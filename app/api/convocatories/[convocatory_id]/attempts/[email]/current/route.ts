import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma, zod } from "@/lib";
import {
  calcSubmissionScore,
  UserSchema,
  QuizSubmissionSchema,
  QuizQuestionSchema,
  QuizConvocatorySchema,
  QuizVersionSchema,
  QuizSchema,
  CertificateSchema,
  UpdateCurrentQuizAttemptSchema,
  DeleteCurrentQuizAttemptSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import {
  QuizSubmission,
  QuizSubmissionStatus,
  QuizQuestion,
  User,
  QuizConvocatory,
  QuizVersion,
  Quiz,
  Certificate,
} from "@/types";

import { getQuestions } from "../../_utils";
import {
  CurrentAttemptError,
  NoAttemptInProgressError,
  AnAttemptIsAlreadyInProgressError,
  OutOfScheduledDateError,
  MaximumAttemptsReachedError,
} from "../../_errors";

export const dynamic = "force-dynamic";

type QuizSubmissionWithQuestions = QuizSubmission & {
  questions: QuizQuestion[];
};

type QuizConvocatoryWithVersionAndQuiz = QuizConvocatory & {
  version: QuizVersion & { quiz: Quiz };
};

export type QuizConvocatoryAttempt = {
  number: number;
  user: User;
  submission: QuizSubmissionWithQuestions | null;
  convocatory: QuizConvocatoryWithVersionAndQuiz;
};

type Params = {
  convocatory_id: string;
  email: string;
};

export type GetResponse =
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryAttempt>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const attempt = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: {
          id: params.convocatory_id,
          users: { some: { email: params.email } },
        },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
      });

      const user = await tx.user.findFirstOrThrow({
        where: { email: params.email },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
        include: { questions: true },
      });

      return {
        number,
        user,
        submission,
        convocatory,
      };
    });

    const schema = zod.object({
      number: zod.number().int().nonnegative(),
      user: UserSchema,
      submission: QuizSubmissionSchema.merge(
        zod.object({
          questions: QuizQuestionSchema.array(),
        })
      ).nullable(),
      convocatory: QuizConvocatorySchema.merge(
        zod.object({
          version: QuizVersionSchema.merge(
            zod.object({
              quiz: QuizSchema,
            })
          ),
        })
      ),
    });

    return NextResponse.json({
      data: schema.parse(attempt),
      error: null,
    });
  } catch (error) {
    if (error instanceof CurrentAttemptError) {
      return NextResponse.json(
        {
          data: null,
          error: error.message,
        },
        {
          status: error.status,
          statusText: error.statusText,
        }
      );
    }

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
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryAttempt>;

export async function POST(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<PostResponse>> {
  try {
    const attempt = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: {
          id: params.convocatory_id,
          users: { some: { email: params.email } },
        },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
      });

      const user = await tx.user.findFirstOrThrow({
        where: { email: params.email },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
        include: { questions: true },
      });

      if (submission) throw new AnAttemptIsAlreadyInProgressError();

      const onTime =
        convocatory.startAt <= new Date() && convocatory.endAt >= new Date();

      if (!onTime) throw new OutOfScheduledDateError();

      const tryable = number <= convocatory.attempts;

      if (!tryable) throw new MaximumAttemptsReachedError();

      const questions = await getQuestions({
        version: convocatory.version.id,
        quantity: convocatory.questions,
      });

      const created = await tx.quizSubmission.create({
        data: {
          convocatory: { connect: { id: params.convocatory_id } },
          user: { connect: { email: params.email } },
          questions: { connect: questions.map(({ id }) => ({ id })) },
        },
        include: { questions: true },
      });

      return {
        number,
        user,
        submission: created,
        convocatory,
      };
    });

    const schema = zod.object({
      number: zod.number().int().nonnegative(),
      user: UserSchema,
      submission: QuizSubmissionSchema.merge(
        zod.object({
          questions: QuizQuestionSchema.array(),
        })
      ).nullable(),
      convocatory: QuizConvocatorySchema.merge(
        zod.object({
          version: QuizVersionSchema.merge(
            zod.object({
              quiz: QuizSchema,
            })
          ),
        })
      ),
    });

    return NextResponse.json(
      {
        data: schema.parse(attempt),
        error: null,
      },
      {
        status: StatusCodes.CREATED,
        statusText: ReasonPhrases.CREATED,
      }
    );
  } catch (error) {
    if (error instanceof CurrentAttemptError) {
      return NextResponse.json(
        {
          data: null,
          error: error.message,
        },
        {
          status: error.status,
          statusText: error.statusText,
        }
      );
    }

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

export type PutResponse =
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryAttempt>;

export async function PUT(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PutResponse>> {
  try {
    const attempt = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: {
          id: params.convocatory_id,
          users: { some: { email: params.email } },
        },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
      });

      const user = await tx.user.findFirstOrThrow({
        where: { email: params.email },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
        include: { questions: true },
      });

      if (!submission) throw new NoAttemptInProgressError();

      const body = await request.json();

      const result = UpdateCurrentQuizAttemptSchema.safeParse(body);

      if (!result.success) {
        throw new CurrentAttemptError(
          result.error.message,
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST
        );
      }

      const updated = await tx.quizSubmission.update({
        where: { id: submission.id },
        data: { results: { set: result.data.results } },
        include: { questions: true },
      });

      return {
        number,
        user,
        submission: updated,
        convocatory,
      };
    });

    const schema = zod.object({
      number: zod.number().int().nonnegative(),
      user: UserSchema,
      submission: QuizSubmissionSchema.merge(
        zod.object({
          questions: QuizQuestionSchema.array(),
        })
      ).nullable(),
      convocatory: QuizConvocatorySchema.merge(
        zod.object({
          version: QuizVersionSchema.merge(
            zod.object({
              quiz: QuizSchema,
            })
          ),
        })
      ),
    });

    return NextResponse.json({
      data: schema.parse(attempt),
      error: null,
    });
  } catch (error) {
    if (error instanceof CurrentAttemptError) {
      return NextResponse.json(
        {
          data: null,
          error: error.message,
        },
        {
          status: error.status,
          statusText: error.statusText,
        }
      );
    }

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

export type DeleteResponse = RouteSegmentUnifiedSerializedResponse<{
  attempt: QuizConvocatoryAttempt;
  certificate: Certificate | null;
}>;

export async function DELETE(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const { attempt, certificate } = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: {
          id: params.convocatory_id,
          users: { some: { email: params.email } },
        },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
      });

      const user = await tx.user.findFirstOrThrow({
        where: { email: params.email },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email: params.email },
        },
        include: { questions: true },
      });

      if (!submission) throw new NoAttemptInProgressError();

      const body = await request.json();

      const result = DeleteCurrentQuizAttemptSchema.safeParse(body);

      if (!result.success) {
        throw new CurrentAttemptError(
          result.error.message,
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST
        );
      }

      const updated = await tx.quizSubmission.update({
        where: { id: submission.id },
        data: {
          status: QuizSubmissionStatus.SUBMITTED,
          reason: result.data.reason,
          results: { set: result.data.results },
          endedAt: new Date(),
        },
        include: { questions: true },
      });

      const { passed } = calcSubmissionScore(
        updated as QuizSubmissionWithQuestions
      );

      if (passed) {
        const certificate = await tx.certificate.upsert({
          where: {
            userId_convocatoryId: {
              userId: updated.userId,
              convocatoryId: updated.convocatoryId,
            },
          },
          create: {
            user: { connect: { email: params.email } },
            convocatory: { connect: { id: params.convocatory_id } },
          },
          update: {
            user: { connect: { email: params.email } },
            convocatory: { connect: { id: params.convocatory_id } },
          },
        });

        return {
          certificate,
          attempt: {
            number,
            user,
            submission: updated,
            convocatory,
          },
        };
      }

      return {
        certificate: null,
        attempt: {
          number,
          user,
          submission: updated,
          convocatory,
        },
      };
    });

    const schema = zod.object({
      attempt: zod.object({
        number: zod.number().int().nonnegative(),
        user: UserSchema,
        submission: QuizSubmissionSchema.merge(
          zod.object({
            questions: QuizQuestionSchema.array(),
          })
        ).nullable(),
        convocatory: QuizConvocatorySchema.merge(
          zod.object({
            version: QuizVersionSchema.merge(
              zod.object({
                quiz: QuizSchema,
              })
            ),
          })
        ),
      }),
      certificate: CertificateSchema.nullable(),
    });

    return NextResponse.json({
      data: schema.parse({ attempt, certificate }),
      error: null,
    });
  } catch (error) {
    if (error instanceof CurrentAttemptError) {
      return NextResponse.json(
        {
          data: null,
          error: error.message,
        },
        {
          status: error.status,
          statusText: error.statusText,
        }
      );
    }

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
