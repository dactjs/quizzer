import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  CreateQuizSubmissionSchema,
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
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<
  QuizSubmissionWithConvocatoryAndUser[]
>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const submissions = await prisma.quizSubmission.findMany({
      where: { convocatory: { id: params.convocatory_id } },
      include: {
        convocatory: { include: { version: { include: { quiz: true } } } },
        user: true,
      },
    });

    return NextResponse.json({
      data: submissions,
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
  RouteSegmentUnifiedSerializedResponse<QuizSubmissionWithConvocatoryAndUser>;

export async function POST(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PostResponse>> {
  try {
    const body = await request.json();

    const result = CreateQuizSubmissionSchema.safeParse(body);

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

    const submission = await prisma.quizSubmission.create({
      data: {
        user: { connect: { id: result.data.user } },
        convocatory: { connect: { id: params.convocatory_id } },
      },
      include: {
        convocatory: { include: { version: { include: { quiz: true } } } },
        user: true,
      },
    });

    return NextResponse.json(
      {
        data: submission,
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
