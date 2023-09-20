import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  CreateQuizQuestionSchema,
  UpsertQuizVersionQuestionsSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { QuizQuestion } from "@/types";

export const dynamic = "force-dynamic";

type Params = {
  quiz_id: string;
  version_id: string;
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<QuizQuestion[]>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const questions = await prisma.quizQuestion.findMany({
      where: { id: params.version_id },
    });

    return NextResponse.json({
      data: questions,
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : ReasonPhrases.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      {
        data: null,
        error: message,
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
      }
    );
  }
}

export type PostResponse = RouteSegmentUnifiedSerializedResponse<QuizQuestion>;

export async function POST(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PostResponse>> {
  try {
    const body = await request.json();

    const result = CreateQuizQuestionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          data: null,
          error: result.error.message,
        },
        {
          status: StatusCodes.BAD_REQUEST,
          statusText: ReasonPhrases.BAD_REQUEST,
        }
      );
    }

    const question = await prisma.quizQuestion.create({
      data: {
        prompt: result.data.prompt,
        description: result.data.description,
        options: result.data.options,
        answer: result.data.answer,
        category: result.data.category,
        version: { connect: { id: params.version_id } },
      },
    });

    return NextResponse.json(
      {
        data: question,
        error: null,
      },
      {
        status: StatusCodes.CREATED,
        statusText: ReasonPhrases.CREATED,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : ReasonPhrases.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      {
        data: null,
        error: message,
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
      }
    );
  }
}

export type PutResponse = RouteSegmentUnifiedSerializedResponse<QuizQuestion[]>;

export async function PUT(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PutResponse>> {
  try {
    const body = await request.json();

    const result = UpsertQuizVersionQuestionsSchema.safeParse(JSON.parse(body));

    if (!result.success) {
      return NextResponse.json(
        {
          data: null,
          error: result.error.message,
        },
        {
          status: StatusCodes.BAD_REQUEST,
          statusText: ReasonPhrases.BAD_REQUEST,
        }
      );
    }

    const questions = await prisma.$transaction(async (tx) => {
      for await (const question of result.data) {
        await tx.quizQuestion.upsert({
          where: {
            prompt_versionId: {
              prompt: question.prompt,
              versionId: params.version_id,
            },
          },
          create: {
            prompt: question.prompt,
            description: question.description,
            options: question.options,
            answer: question.answer,
            category: question.category,
            version: { connect: { id: params.version_id } },
          },
          update: {
            prompt: question.prompt,
            description: question.description,
            options: question.options,
            answer: question.answer,
            category: question.category,
          },
        });
      }

      const questions = await tx.quizQuestion.findMany({
        where: { version: { id: params.version_id } },
      });

      return questions;
    });

    return NextResponse.json(
      {
        data: questions,
        error: null,
      },
      {
        status: StatusCodes.CREATED,
        statusText: ReasonPhrases.CREATED,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : ReasonPhrases.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      {
        data: null,
        error: message,
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
