import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const topUsers = await prisma.user.findMany({
      take: 100,
      orderBy: {
        totalScore: "desc",
      },
      select: {
        id: true,
        name: true,
        totalScore: true,
        image: true,
      },
    });

    type LeaderboardEntry = {
      id: number;
      name: string | null;
      totalScore: number;
      image: string | null;
    };

    const rankedUsers = (topUsers as LeaderboardEntry[]).map(
      (user: LeaderboardEntry, index: number) => ({
        ...user,
        rank: index + 1,
      })
    );

    return NextResponse.json(rankedUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
