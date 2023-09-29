import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma, zod } from "@/lib";
import {
  CertificateSchema,
  UserSchema,
  QuizConvocatorySchema,
  QuizVersionSchema,
  QuizSchema,
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
  certificate_id: string;
};

export type GetResponse =
  RouteSegmentUnifiedSerializedResponse<CertificateWithUserAndConvocatory | null>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.certificate_id },
      include: {
        user: true,
        convocatory: { include: { version: { include: { quiz: true } } } },
      },
    });

    const schema = CertificateSchema.merge(
      zod.object({
        user: UserSchema,
        convocatory: QuizConvocatorySchema.merge(
          zod.object({
            version: QuizVersionSchema.merge(
              zod.object({
                quiz: QuizSchema,
              })
            ),
          })
        ),
      })
    );

    return NextResponse.json({
      data: schema.parse(certificate),
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
  RouteSegmentUnifiedSerializedResponse<CertificateWithUserAndConvocatory>;

export async function DELETE(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const certificate = await prisma.certificate.delete({
      where: { id: params.certificate_id },
      include: {
        user: true,
        convocatory: { include: { version: { include: { quiz: true } } } },
      },
    });

    const schema = CertificateSchema.merge(
      zod.object({
        user: UserSchema,
        convocatory: QuizConvocatorySchema.merge(
          zod.object({
            version: QuizVersionSchema.merge(
              zod.object({
                quiz: QuizSchema,
              })
            ),
          })
        ),
      })
    );

    return NextResponse.json({
      data: schema.parse(certificate),
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
