import { NextResponse } from "next/server";
import { auth } from "../../../../../auth"; // Corrected import path for auth from your auth.ts file
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth(); // Use auth() to get the session

  if (!session || !session.user || !session.user.memberId) {
    // Check for session.user.memberId as per your auth.ts
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let targetPlayerId: number;

  if (params.id === "me") {
    // session.user.memberId is already a number as per your auth.ts jwt and session callbacks
    targetPlayerId = session.user.memberId;
  } else {
    const paramPlayerId = parseInt(params.id, 10);
    if (isNaN(paramPlayerId)) {
      return NextResponse.json(
        { message: "Invalid player ID format in URL" },
        { status: 400 }
      );
    }
    // Optional: Implement admin check or ensure users can only fetch their own progress
    // For now, allowing fetch if ID matches session user ID, or if it's 'me'
    if (paramPlayerId !== session.user.memberId) {
      // Compare with session.user.memberId
      // If not admin and trying to access someone else's progress
      // if (session.user.role !== 'admin') { // Assuming you have a role in your session
      return NextResponse.json(
        { message: "Forbidden: You can only access your own progress." },
        { status: 403 }
      );
      // }
    }
    targetPlayerId = paramPlayerId;
  }

  try {
    const userProgress = await prisma.progress.findUnique({
      where: { playerId: targetPlayerId },
      include: {
        // Optionally include player details if needed by frontend
        player: {
          select: {
            Player_name: true,
            Player_ID: true,
          },
        },
      },
    });

    if (!userProgress) {
      // It's valid for a user to not have progress yet, return an empty state or specific structure
      return NextResponse.json(
        {
          message:
            "Progress not found for this user. They may not have played yet.",
          progress: null, // Or a default progress object
          // levelReached: 0, percentComplete: 0, lastPlayedAt: null
        },
        { status: 200 }
      ); // 200 or 404 depends on how you want to treat "no progress"
    }

    return NextResponse.json(userProgress, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress:", error);
    // It's good practice to avoid leaking raw error messages to the client
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      // errorMessage = error.message; // Be cautious with this in production
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
