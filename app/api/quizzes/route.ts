import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  CreateQuizSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { Quiz } from "@/types";

export const dynamic = "force-dynamic";

export type GetResponse = RouteSegmentUnifiedSerializedResponse<Quiz[]>;

export async function GET(): Promise<NextResponse<GetResponse>> {
  try {
    const quizzes = await prisma.quiz.findMany();

    return NextResponse.json({
      data: quizzes,
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

export type PostResponse = RouteSegmentUnifiedSerializedResponse<Quiz>;

export async function POST(
  request: Request
): Promise<NextResponse<PostResponse>> {
  try {
    const body = await request.json();

    const result = CreateQuizSchema.safeParse(body);

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

    const quiz = await prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.create({
        data: { subject: result.data.subject },
      });

      return await tx.quiz.update({
        where: { id: quiz.id },
        data: {
          currentVersion: {
            create: {
              name: result.data.firstVersionName,
              quiz: { connect: { id: quiz.id } },
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        data: quiz,
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
