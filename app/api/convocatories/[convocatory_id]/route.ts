import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma, zod } from "@/lib";
import {
  QuizConvocatorySchema,
  QuizVersionSchema,
  QuizSchema,
  QuizQuestionSchema,
  UserSchema,
  UpdateQuizConvocatorySchema,
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

type Params = {
  convocatory_id: string;
};

export type GetResponse =
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryWithVersionAndUsers | null>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const convocatory = await prisma.quizConvocatory.findUnique({
      where: { id: params.convocatory_id },
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

    return NextResponse.json({
      data: schema.parse(convocatory),
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
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryWithVersionAndUsers>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PatchResponse>> {
  try {
    const body = await request.json();

    const result = UpdateQuizConvocatorySchema.safeParse(body);

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

    const convocatory = await prisma.quizConvocatory.update({
      where: { id: params.convocatory_id },
      data: {
        questions: result.data.questions,
        attempts: result.data.attempts,
        timer: result.data.timer,
        startAt: result.data.startAt,
        endAt: result.data.endAt,
        ...(result.data.version && {
          version: { connect: { id: result.data.version } },
        }),
        ...(result.data.users && {
          users: { set: result.data.users.map((user) => ({ id: user })) },
        }),
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

    return NextResponse.json({
      data: schema.parse(convocatory),
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
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryWithVersionAndUsers>;

export async function DELETE(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const convocatory = await prisma.quizConvocatory.delete({
      where: { id: params.convocatory_id },
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

    return NextResponse.json({
      data: schema.parse(convocatory),
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
