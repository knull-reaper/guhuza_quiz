import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const SHARE_BONUS_POINTS = 100;

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const referer = request.headers.get("referer");
    const appBaseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000";

    if (!referer || !referer.startsWith(appBaseUrl)) {
      console.warn(
        `Share bonus attempt with invalid referer: ${referer} from user: ${session.user.email}`
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        totalScore: {
          increment: SHARE_BONUS_POINTS,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Share bonus awarded successfully!",
        newTotalScore: updatedUser.totalScore,
        bonusAwarded: SHARE_BONUS_POINTS,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/shareBonus:", error);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
