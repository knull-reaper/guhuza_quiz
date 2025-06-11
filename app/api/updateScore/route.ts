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
      const totalLevels = await prisma.quizLevel.count();
      let percentComplete = 0;
      if (totalLevels > 0) {
        const currentLevelDetails = await prisma.quizLevel.findUnique({
          where: { id: actualQuizLevelIdToUpdate },
        });
        if (currentLevelDetails) {
          percentComplete = Math.min(
            100,
            (currentLevelDetails.number / totalLevels) * 100
          );
        } else {
          percentComplete = Math.min(
            100,
            (actualQuizLevelIdToUpdate / totalLevels) * 100
          );
        }
      } else {
        percentComplete = actualQuizLevelIdToUpdate > 0 ? 100 : 0;
      }

      await prisma.progress.upsert({
        where: { userId: userIdFromSession },
        update: {
          levelReached: actualQuizLevelIdToUpdate,
          percentComplete: percentComplete,
        },
        create: {
          userId: userIdFromSession,
          levelReached: actualQuizLevelIdToUpdate,
          percentComplete: percentComplete,
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
