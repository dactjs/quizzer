import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma, zod } from "@/lib";
import {
  QuizVersionSchema,
  QuizSchema,
  QuizQuestionSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { QuizVersion, Quiz, QuizQuestion } from "@/types";

export const dynamic = "force-dynamic";

export type QuizVersionWithQuizAndQuestions = QuizVersion & {
  quiz: Quiz;
  questions: QuizQuestion[];
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<
  QuizVersionWithQuizAndQuestions[]
>;

export async function GET(_: Request): Promise<NextResponse<GetResponse>> {
  try {
    const versions = await prisma.quizVersion.findMany({
      include: { quiz: true, questions: true },
      orderBy: { quiz: { subject: "asc" } },
    });

    const schema = QuizVersionSchema.merge(
      zod.object({
        quiz: QuizSchema,
        questions: QuizQuestionSchema.array(),
      })
    ).array();

    return NextResponse.json({
      data: schema.parse(versions),
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
