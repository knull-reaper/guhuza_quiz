import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized: Not logged in or session invalid." },
        { status: 401 }
      );
    }

    const userIdFromSession = parseInt(session.user.id, 10);
    if (isNaN(userIdFromSession)) {
      return NextResponse.json(
        { message: "Invalid user ID in session." },
        { status: 400 }
      );
    }

    const {
      finalScore,
      newlevel: completedQuizId,
      attemptScore,
    } = await req.json();

    if (
      finalScore === undefined ||
      completedQuizId === undefined ||
      attemptScore === undefined ||
      typeof completedQuizId !== "number" ||
      typeof finalScore !== "number" ||
      typeof attemptScore !== "number"
    ) {
      return NextResponse.json(
        {
          message:
            "finalScore (number), completedQuizId (number), and attemptScore (number) are required.",
        },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: completedQuizId },
      select: { quizLevelId: true },
    });

    if (!quiz || quiz.quizLevelId === null) {
      return NextResponse.json(
        {
          message: `Quiz with ID ${completedQuizId} not found or not associated with a level.`,
        },
        { status: 404 }
      );
    }

    const actualQuizLevelIdToUpdate = quiz.quizLevelId;

    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        UserQuizAttemptUnique: {
          userId: userIdFromSession,
          quizId: completedQuizId,
        },
      },
    });

    if (existingAttempt) {
      if (attemptScore > existingAttempt.score) {
        await prisma.quizAttempt.update({
          where: {
            UserQuizAttemptUnique: {
              userId: userIdFromSession,
              quizId: completedQuizId,
            },
          },
          data: {
            score: attemptScore,
            completedAt: new Date(),
          },
        });
      } else {
        await prisma.quizAttempt.update({
          where: {
            UserQuizAttemptUnique: {
              userId: userIdFromSession,
              quizId: completedQuizId,
            },
          },
          data: { completedAt: new Date() },
        });
      }
    } else {
      await prisma.quizAttempt.create({
        data: {
          userId: userIdFromSession,
          quizId: completedQuizId,
          score: attemptScore,
          completedAt: new Date(),
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdFromSession },
      data: {
        totalScore: finalScore,
        quizLevelId: actualQuizLevelIdToUpdate,
      },
      include: { milestone: true },
    });

    if (updatedUser) {
      // Calculate highest unlocked level based on the new finalScore
      const allQuizLevels = await prisma.quizLevel.findMany({
        orderBy: { number: "asc" },
      });

      let highestUnlockedLevelNumber = 1; // Default to 1
      if (allQuizLevels.length > 0) {
        // Find the highest level number the user's finalScore unlocks
        for (let i = allQuizLevels.length - 1; i >= 0; i--) {
          if (finalScore >= allQuizLevels[i].unlockScoreRequired) {
            highestUnlockedLevelNumber = allQuizLevels[i].number;
            break;
          }
        }
        // Ensure if score is less than first level's requirement (besides level 1 itself if it's 0), it defaults to first level number
        if (
          finalScore < allQuizLevels[0].unlockScoreRequired &&
          allQuizLevels[0].number !== highestUnlockedLevelNumber
        ) {
          // This case might be tricky if level 1 requires >0 points and user has less.
          // However, typically level 1 requires 0. If user has < L1 score, they are at L1.
          // If highestUnlockedLevelNumber is already 1 (or the first level's number), this is fine.
          // The loop above should handle finding the highest unlocked. If no level is unlocked (score too low for any level > 0 pts),
          // highestUnlockedLevelNumber might remain its default or be set to the first level if its score is 0.
          // Let's ensure it's at least the first level's number if scores are very low.
          if (allQuizLevels[0].unlockScoreRequired === 0) {
            // If the first level requires 0 and wasn't picked up, ensure it is.
            // The loop should correctly assign allQuizLevels[0].number if finalScore >= 0.
          } else if (finalScore < allQuizLevels[0].unlockScoreRequired) {
            // If score is less than the very first level's requirement (and that req is >0)
            // This implies they haven't even unlocked the first level.
            // This state should ideally not occur if level 1 is 0 points.
            // For safety, if the loop didn't set a higher level, and score is low, it implies they are at the conceptual "start" or level 1.
            // The loop correctly sets highestUnlockedLevelNumber to the highest *actually unlocked* level.
            // If finalScore is 0, and L1 requires 0, highestUnlockedLevelNumber will be L1's number.
          }
        }
      }

      // Percent complete calculation (can remain based on the level of the quiz just played, or also use highestUnlockedLevelNumber)
      // For now, keeping original percentComplete logic based on the quiz just finished.
      const totalLevels = allQuizLevels.length; // Use count from fetched levels
      let percentComplete = 0;
      if (totalLevels > 0) {
        const playedQuizLevelDetails = allQuizLevels.find(
          (l) => l.id === actualQuizLevelIdToUpdate
        );
        if (playedQuizLevelDetails) {
          percentComplete = Math.min(
            100,
            (playedQuizLevelDetails.number / totalLevels) * 100
          );
        } else {
          // Fallback if playedQuizLevelDetails not found (should not happen if actualQuizLevelIdToUpdate is valid)
          // This part of logic for percentComplete might need review based on product requirements
          // For now, using a simple fallback, or it could be based on highestUnlockedLevelNumber
          const highestLevelDetails = allQuizLevels.find(
            (l) => l.number === highestUnlockedLevelNumber
          );
          if (highestLevelDetails) {
            percentComplete = Math.min(
              100,
              (highestLevelDetails.number / totalLevels) * 100
            );
          }
        }
      } else {
        percentComplete = 0; // No levels, 0% complete
      }

      await prisma.progress.upsert({
        where: { userId: userIdFromSession },
        update: {
          levelReached: highestUnlockedLevelNumber, // Use the calculated highest unlocked level number
          percentComplete: parseFloat(percentComplete.toFixed(2)), // Ensure float with precision
        },
        create: {
          userId: userIdFromSession,
          levelReached: highestUnlockedLevelNumber, // Use the calculated highest unlocked level number
          percentComplete: parseFloat(percentComplete.toFixed(2)), // Ensure float with precision
        },
      });
    } else {
      return NextResponse.json(
        { message: "User not found for update." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User score, high score, and progress updated successfully.",
        user: updatedUser,
        newQuizLevelId: actualQuizLevelIdToUpdate,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error in /api/updateScore:", e);
    let errorMessage = "Failed to update score/progress.";
    if (e instanceof Error) {
    }
    return NextResponse.json(
      { message: errorMessage, error: String(e) },
      { status: 500 }
    );
  }
}
