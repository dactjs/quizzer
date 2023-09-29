import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  QuizQuestionSchema,
  UpdateQuizQuestionSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { QuizQuestion } from "@/types";

export const dynamic = "force-dynamic";

type Params = {
  quiz_id: string;
  version_id: string;
  question_id: string;
};

export type GetResponse =
  RouteSegmentUnifiedSerializedResponse<QuizQuestion | null>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const question = await prisma.quizQuestion.findUnique({
      where: { id: params.question_id },
    });

    const schema = QuizQuestionSchema.nullable();

    return NextResponse.json({
      data: schema.parse(question),
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

export type PatchResponse = RouteSegmentUnifiedSerializedResponse<QuizQuestion>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PatchResponse>> {
  try {
    const body = await request.json();

    const result = UpdateQuizQuestionSchema.safeParse(body);

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

    const question = await prisma.quizQuestion.update({
      where: { id: params.question_id },
      data: {
        prompt: result.data.prompt,
        description: result.data.description,
        options: result.data.options,
        answer: result.data.answer,
        category: result.data.category,
      },
    });

    const schema = QuizQuestionSchema;

    return NextResponse.json({
      data: schema.parse(question),
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

export type DeleteResponse =
  RouteSegmentUnifiedSerializedResponse<QuizQuestion>;

export async function DELETE(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const question = await prisma.quizQuestion.delete({
      where: { id: params.question_id },
    });

    const schema = QuizQuestionSchema;

    return NextResponse.json({
      data: schema.parse(question),
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
