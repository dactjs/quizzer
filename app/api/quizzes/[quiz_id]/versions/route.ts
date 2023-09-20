import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  CreateQuizVersionSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { QuizVersion, Quiz, QuizQuestion } from "@/types";

export const dynamic = "force-dynamic";

export type QuizVersionWithQuizAndQuestions = QuizVersion & {
  quiz: Quiz;
  questions: QuizQuestion[];
};

type Params = {
  quiz_id: string;
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<
  QuizVersionWithQuizAndQuestions[]
>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const versions = await prisma.quizVersion.findMany({
      where: { quiz: { id: params.quiz_id } },
      include: { quiz: true, questions: true },
    });

    return NextResponse.json({
      data: versions,
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

export type PostResponse =
  RouteSegmentUnifiedSerializedResponse<QuizVersionWithQuizAndQuestions>;

export async function POST(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PostResponse>> {
  try {
    const body = await request.json();

    const result = CreateQuizVersionSchema.safeParse(body);

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

    const version = await prisma.quizVersion.create({
      data: {
        name: result.data.name,
        quiz: { connect: { id: params.quiz_id } },
      },
      include: { quiz: true, questions: true },
    });

    return NextResponse.json(
      {
        data: version,
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
