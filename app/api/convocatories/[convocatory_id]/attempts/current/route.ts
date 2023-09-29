import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma, zod } from "@/lib";
import {
  UserSchema,
  QuizSubmissionSchema,
  QuizQuestionSchema,
  QuizConvocatorySchema,
  QuizVersionSchema,
  QuizSchema,
  CertificateSchema,
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

import { CurrentAttemptError } from "../_errors";

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
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<
  Array<{
    attempt: QuizConvocatoryAttempt;
    certificate: Certificate | null;
  }>
>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const attempts = await prisma.$transaction(async (tx) => {
      const { users, certificates, ...convocatory } =
        await tx.quizConvocatory.findUniqueOrThrow({
          where: { id: params.convocatory_id },
          include: {
            version: { include: { quiz: true } },
            users: true,
            certificates: true,
          },
        });

      const promises = users.map(async (user) => {
        const number = await tx.quizSubmission.count({
          where: {
            convocatory: { id: params.convocatory_id },
            user: { id: user.id },
          },
        });

        const submission = await tx.quizSubmission.findFirst({
          where: {
            status: QuizSubmissionStatus.DRAFT,
            convocatory: { id: params.convocatory_id },
            user: { id: user.id },
          },
          include: { questions: true },
        });

        const certificate = certificates.find(
          (certificate) => certificate.userId === user.id
        );

        return {
          certificate: certificate ?? null,
          attempt: {
            number,
            user,
            submission,
            convocatory,
          },
        };
      });

      return Promise.all(promises);
    });

    const schema = zod
      .object({
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
      })
      .array();

    return NextResponse.json({
      data: schema.parse(attempts),
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
