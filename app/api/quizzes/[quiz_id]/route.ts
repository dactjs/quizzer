import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  QuizSchema,
  UpdateQuizSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { Quiz } from "@/types";

export const dynamic = "force-dynamic";

type Params = {
  quiz_id: string;
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<Quiz | null>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quiz_id },
    });

    const schema = QuizSchema.nullable();

    return NextResponse.json({
      data: schema.parse(quiz),
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

export type PatchResponse = RouteSegmentUnifiedSerializedResponse<Quiz>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PatchResponse>> {
  try {
    const body = await request.json();

    const result = UpdateQuizSchema.safeParse(body);

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

    const quiz = await prisma.quiz.update({
      where: { id: params.quiz_id },
      data: {
        subject: result.data.subject,
        ...(result.data.currentVersion && {
          currentVersion: {
            connect: { id: result.data.currentVersion },
          },
        }),
      },
    });

    const schema = QuizSchema;

    return NextResponse.json({
      data: schema.parse(quiz),
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

export type DeleteResponse = RouteSegmentUnifiedSerializedResponse<Quiz>;

export async function DELETE(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const quiz = await prisma.quiz.delete({ where: { id: params.quiz_id } });

    const schema = QuizSchema;

    return NextResponse.json({
      data: schema.parse(quiz),
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
