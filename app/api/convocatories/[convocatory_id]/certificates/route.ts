import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  CreateCertificateSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { Certificate, User, QuizConvocatory, QuizVersion, Quiz } from "@/types";

export const dynamic = "force-dynamic";

type QuizConvocatoryWithVersion = QuizConvocatory & {
  version: QuizVersion & { quiz: Quiz };
};

export type CertificateWithUserAndConvocatory = Certificate & {
  user: User;
  convocatory: QuizConvocatoryWithVersion;
};

type Params = {
  convocatory_id: string;
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<
  CertificateWithUserAndConvocatory[]
>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { convocatory: { id: params.convocatory_id } },
      include: {
        user: true,
        convocatory: { include: { version: { include: { quiz: true } } } },
      },
    });

    return NextResponse.json({
      data: certificates,
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
  RouteSegmentUnifiedSerializedResponse<CertificateWithUserAndConvocatory>;

export async function POST(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PostResponse>> {
  try {
    const body = await request.json();

    const result = CreateCertificateSchema.safeParse(body);

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

    const certificate = await prisma.certificate.create({
      data: {
        user: { connect: { id: result.data.user } },
        convocatory: { connect: { id: params.convocatory_id } },
      },
      include: {
        user: true,
        convocatory: { include: { version: { include: { quiz: true } } } },
      },
    });

    return NextResponse.json(
      {
        data: certificate,
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
