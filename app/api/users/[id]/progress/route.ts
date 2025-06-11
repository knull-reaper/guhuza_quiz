import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "Unauthorized: Session or user ID missing." },
      { status: 401 }
    );
  }

  let targetUserId: number;

  const sessionUserIdStr = session.user.id;
  const sessionUserIdNum = parseInt(sessionUserIdStr, 10);

  if (isNaN(sessionUserIdNum)) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid user ID in session." },
      { status: 401 }
    );
  }

  if (params.id === "me") {
    targetUserId = sessionUserIdNum;
  } else {
    const paramIdNum = parseInt(params.id, 10);
    if (isNaN(paramIdNum)) {
      return NextResponse.json(
        { message: "Invalid user ID format in URL." },
        { status: 400 }
      );
    }

    if (paramIdNum !== sessionUserIdNum) {
      return NextResponse.json(
        { message: "Forbidden: You can only access your own progress." },
        { status: 403 }
      );
    }
    targetUserId = paramIdNum;
  }

  try {
    const userProgress = await prisma.progress.findUnique({
      where: { userId: targetUserId },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!userProgress) {
      return NextResponse.json(
        {
          message:
            "Progress not found for this user. They may not have played yet.",
          progress: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(userProgress, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress:", error);

    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
    }
    return NextResponse.json(
      {
        message: errorMessage,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
