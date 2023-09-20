import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
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
} from "@/types";

import { getQuestions } from "./_utils";
import {
  CurrentAttemptError,
  NoAttemptInProgressError,
  AnAttemptIsAlreadyInProgressError,
  OutOfScheduledDateError,
  MaximumAttemptsReachedError,
} from "./_errors";

export const dynamic = "force-dynamic";

type QuizSubmissionWithQuestionsAndUser = QuizSubmission & {
  questions: QuizQuestion[];
  user: User;
};

type QuizConvocatoryWithVersionAndQuiz = QuizConvocatory & {
  version: QuizVersion & { quiz: Quiz };
};

export type QuizConvocatoryAttempt = {
  number: number;
  submission: QuizSubmissionWithQuestionsAndUser | null;
  convocatory: QuizConvocatoryWithVersionAndQuiz;
};

type Params = {
  convocatory_id: string;
};

export type GetResponse =
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryAttempt>;

export async function GET(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          data: null,
          error: ReasonPhrases.UNAUTHORIZED,
        },
        {
          status: StatusCodes.UNAUTHORIZED,
          statusText: ReasonPhrases.UNAUTHORIZED,
        }
      );
    }

    const attempt = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: { id: params.convocatory_id, users: { some: { email } } },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
        include: { questions: true, user: true },
      });

      return {
        number,
        submission,
        convocatory,
      };
    });

    return NextResponse.json(
      {
        data: attempt,
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

export type PostResponse =
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryAttempt>;

export async function POST(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PostResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          data: null,
          error: ReasonPhrases.UNAUTHORIZED,
        },
        {
          status: StatusCodes.UNAUTHORIZED,
          statusText: ReasonPhrases.UNAUTHORIZED,
        }
      );
    }

    const attempt = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: { id: params.convocatory_id, users: { some: { email } } },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
        include: { questions: true, user: true },
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
          user: { connect: { email } },
          questions: { connect: questions.map(({ id }) => ({ id })) },
        },
        include: { questions: true, user: true },
      });

      return {
        number,
        submission: created,
        convocatory,
      };
    });

    return NextResponse.json(
      {
        data: attempt,
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
    const { searchParams } = new URL(request.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          data: null,
          error: ReasonPhrases.UNAUTHORIZED,
        },
        {
          status: StatusCodes.UNAUTHORIZED,
          statusText: ReasonPhrases.UNAUTHORIZED,
        }
      );
    }

    const attempt = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: { id: params.convocatory_id, users: { some: { email } } },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
        include: { questions: true, user: true },
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
        include: { questions: true, user: true },
      });

      return {
        number,
        submission: updated,
        convocatory,
      };
    });

    return NextResponse.json(
      {
        data: attempt,
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

export type DeleteResponse =
  RouteSegmentUnifiedSerializedResponse<QuizConvocatoryAttempt>;

export async function DELETE(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PutResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          data: null,
          error: ReasonPhrases.UNAUTHORIZED,
        },
        {
          status: StatusCodes.UNAUTHORIZED,
          statusText: ReasonPhrases.UNAUTHORIZED,
        }
      );
    }

    const attempt = await prisma.$transaction(async (tx) => {
      const convocatory = await tx.quizConvocatory.findUniqueOrThrow({
        where: { id: params.convocatory_id, users: { some: { email } } },
        include: { version: { include: { quiz: true } } },
      });

      const number = await tx.quizSubmission.count({
        where: {
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
      });

      const submission = await tx.quizSubmission.findFirst({
        where: {
          status: QuizSubmissionStatus.DRAFT,
          convocatory: { id: params.convocatory_id },
          user: { email },
        },
        include: { questions: true, user: true },
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
        include: { questions: true, user: true },
      });

      return {
        number,
        submission: updated,
        convocatory,
      };
    });

    return NextResponse.json(
      {
        data: attempt,
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
