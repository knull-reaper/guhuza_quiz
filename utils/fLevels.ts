import prisma from "@/lib/prisma";
import type { QuizLevel } from "@prisma/client";

async function fetchLevels(): Promise<QuizLevel[] | undefined> {
  try {
    const levels = await prisma.quizLevel.findMany({
      orderBy: {
        number: "asc",
      },
    });
    return levels;
  } catch (e) {
    console.error("Error fetching levels:", e);
    return undefined;
  }
}

export default fetchLevels;
