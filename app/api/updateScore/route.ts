import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { playerId, finalScore, newlevel } = await req.json();
    if (!playerId || !finalScore) {
      return NextResponse.json(
        {
          message: "All field are required" + finalScore + newlevel + playerId,
        },
        { status: 400 }
      );
    }

    const updatePlayer = await prisma.player.update({
      where: {
        Player_ID: playerId,
      },
      data: {
        Playerpoint: finalScore,
        Level_Id: newlevel,
      },
      include: {
        milestone: true,
      },
    });

    if (updatePlayer) {
      // Assuming newlevel is the level reached.
      // Placeholder for percentComplete - adjust based on actual game structure (e.g., total levels)
      const percentComplete = newlevel * 10; // Example: if 10 levels total, this gives a rough percentage.

      await prisma.progress.upsert({
        where: { playerId: playerId },
        update: {
          levelReached: newlevel,
          percentComplete: percentComplete,
          // lastPlayedAt is auto-updated by @updatedAt
        },
        create: {
          playerId: playerId,
          levelReached: newlevel,
          percentComplete: percentComplete,
        },
      });
    }

    return NextResponse.json(
      {
        message: "User score and progress updated successfully",
        player: updatePlayer,
        newlevel: newlevel,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to update score/progress: " + e, error: e },
      { status: 500 }
    );
  }
}
