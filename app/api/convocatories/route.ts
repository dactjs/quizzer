import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma, zod } from "@/lib";
import {
  QuizConvocatorySchema,
  QuizVersionSchema,
  QuizSchema,
  QuizQuestionSchema,
  UserSchema,
  CreateQuizConvocatorySchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import {
  QuizConvocatory,
  QuizVersion,
  Quiz,
  QuizQuestion,
  User,
} from "@/types";

export const dynamic = "force-dynamic";

type QuizVersionWithQuizAndQuestions = QuizVersion & {
  quiz: Quiz;
  questions: QuizQuestion[];
};

export type QuizConvocatoryWithVersionAndUsers = QuizConvocatory & {
  version: QuizVersionWithQuizAndQuestions;
  users: User[];
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<
  QuizConvocatoryWithVersionAndUsers[]
>;

export async function GET(
  request: Request
): Promise<NextResponse<GetResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    const startAt = searchParams.get("startAt");
    const endAt = searchParams.get("endAt");

    const convocatories = await prisma.quizConvocatory.findMany({
      where: {
        ...(startAt && { startAt: { gte: new Date(startAt) } }),
        ...(endAt && { endAt: { lte: new Date(endAt) } }),
      },
      include: {
        version: {
          include: {
            quiz: true,
            questions: true,
          },
        },
        users: true,
      },
    });

    const schema = QuizConvocatorySchema.merge(
      zod.object({
        version: QuizVersionSchema.merge(
          zod.object({
            quiz: QuizSchema,
            questions: QuizQuestionSchema.array(),
          })
        ),
        users: UserSchema.array(),
      })
    ).array();

    return NextResponse.json({
      data: schema.parse(convocatories),
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
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryWithVersionAndUsers>;

export async function POST(
  request: Request
): Promise<NextResponse<PostResponse>> {
  try {
    const body = await request.json();

    const result = CreateQuizConvocatorySchema.safeParse(body);

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

    const convocatory = await prisma.quizConvocatory.create({
      data: {
        questions: result.data.questions,
        attempts: result.data.attempts,
        timer: result.data.timer,
        startAt: result.data.startAt,
        endAt: result.data.endAt,
        version: { connect: { id: result.data.version } },
        users: { connect: result.data.users.map((user) => ({ id: user })) },
      },
      include: {
        version: {
          include: {
            quiz: true,
            questions: true,
          },
        },
        users: true,
      },
    });

    const schema = QuizConvocatorySchema.merge(
      zod.object({
        version: QuizVersionSchema.merge(
          zod.object({
            quiz: QuizSchema,
            questions: QuizQuestionSchema.array(),
          })
        ),
        users: UserSchema.array(),
      })
    );

    return NextResponse.json(
      {
        data: schema.parse(convocatory),
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
