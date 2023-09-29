import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  UserSchema,
  UpdateUserSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { User } from "@/types";

export const dynamic = "force-dynamic";

type Params = {
  user_id: string;
};

export type GetResponse = RouteSegmentUnifiedSerializedResponse<User | null>;

export async function GET(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<GetResponse>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.user_id },
    });

    const schema = UserSchema.nullable();

    return NextResponse.json({
      data: schema.parse(user),
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

export type PatchResponse = RouteSegmentUnifiedSerializedResponse<User>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse<PatchResponse>> {
  try {
    const body = await request.json();

    const result = UpdateUserSchema.safeParse(body);

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

    const user = await prisma.user.update({
      where: { id: params.user_id },
      data: {
        name: result.data.name,
        email: result.data.email,
        status: result.data.status,
        role: result.data.role,
      },
    });

    const schema = UserSchema;

    return NextResponse.json({
      data: schema.parse(user),
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

export type DeleteResponse = RouteSegmentUnifiedSerializedResponse<User>;

export async function DELETE(
  _: Request,
  { params }: { params: Params }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const user = await prisma.user.delete({ where: { id: params.user_id } });

    const schema = UserSchema;

    return NextResponse.json({
      data: schema.parse(user),
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
