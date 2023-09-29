import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma, zod } from "@/lib";
import {
  QuizSubmissionSchema,
  QuizConvocatorySchema,
  QuizVersionSchema,
  QuizSchema,
  UserSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import {
  QuizSubmission,
  QuizConvocatory,
  QuizVersion,
  Quiz,
  User,
} from "@/types";

export const dynamic = "force-dynamic";

type QuizConvocatoryWithQuizVersion = QuizConvocatory & {
  version: QuizVersion & { quiz: Quiz };
};

export type QuizSubmissionWithConvocatoryAndUser = QuizSubmission & {
  convocatory: QuizConvocatoryWithQuizVersion;
  user: User;
};

type Params = {
  convocatory_id: string;
  submission_id: string;
};

export type GetResponse =
  RouteSegmentUnifiedSerializedResponse<QuizSubmissionWithConvocatoryAndUser | null>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const submission = await prisma.quizSubmission.findUnique({
      where: { id: params.submission_id },
      include: {
        convocatory: { include: { version: { include: { quiz: true } } } },
        user: true,
      },
    });

    const schema = QuizSubmissionSchema.merge(
      zod.object({
        convocatory: QuizConvocatorySchema.merge(
          zod.object({
            version: QuizVersionSchema.merge(
              zod.object({
                quiz: QuizSchema,
              })
            ),
          })
        ),
        user: UserSchema,
      })
    ).nullable();

    return NextResponse.json({
      data: schema.parse(submission),
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
  RouteSegmentUnifiedSerializedResponse<QuizSubmissionWithConvocatoryAndUser>;

export async function DELETE(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const submission = await prisma.quizSubmission.delete({
      where: { id: params.submission_id },
      include: {
        convocatory: { include: { version: { include: { quiz: true } } } },
        user: true,
      },
    });

    const schema = QuizSubmissionSchema.merge(
      zod.object({
        convocatory: QuizConvocatorySchema.merge(
          zod.object({
            version: QuizVersionSchema.merge(
              zod.object({
                quiz: QuizSchema,
              })
            ),
          })
        ),
        user: UserSchema,
      })
    );

    return NextResponse.json({
      data: schema.parse(submission),
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
