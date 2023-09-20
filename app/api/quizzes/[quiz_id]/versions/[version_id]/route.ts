import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  UpdateQuizVersionSchema,
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
  version_id: string;
};

export type GetResponse =
  RouteSegmentUnifiedSerializedResponse<QuizVersionWithQuizAndQuestions | null>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const version = await prisma.quizVersion.findUnique({
      where: { id: params.version_id },
      include: { quiz: true, questions: true },
    });

    return NextResponse.json({
      data: version,
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

export type PatchResponse =
  RouteSegmentUnifiedSerializedResponse<QuizVersionWithQuizAndQuestions>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PatchResponse>> {
  try {
    const body = await request.json();

    const result = UpdateQuizVersionSchema.safeParse(body);

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

    const version = await prisma.quizVersion.update({
      where: { id: params.version_id },
      data: { name: result.data.name },
      include: { quiz: true, questions: true },
    });

    return NextResponse.json({
      data: version,
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
  RouteSegmentUnifiedSerializedResponse<QuizVersionWithQuizAndQuestions>;

export async function DELETE(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const version = await prisma.quizVersion.delete({
      where: { id: params.version_id },
      include: { quiz: true, questions: true },
    });

    return NextResponse.json({
      data: version,
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
