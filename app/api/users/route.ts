import { NextResponse } from "next/server";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { prisma } from "@/lib";
import {
  CreateUserSchema,
  RouteSegmentUnifiedSerializedResponse,
} from "@/schemas";
import { User } from "@/types";

export const dynamic = "force-dynamic";

export type GetResponse = RouteSegmentUnifiedSerializedResponse<User[]>;

export async function GET(): Promise<NextResponse<GetResponse>> {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({
      data: users,
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

export type PostResponse = RouteSegmentUnifiedSerializedResponse<User>;

export async function POST(
  request: Request
): Promise<NextResponse<PostResponse>> {
  try {
    const body = await request.json();

    const result = CreateUserSchema.safeParse(body);

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

    const user = await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
      },
    });

    return NextResponse.json(
      {
        data: user,
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
