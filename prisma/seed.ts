import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.quiz.deleteMany({});
  await prisma.quizLevel.deleteMany({});
  console.log("Deleted existing quizzes and quiz levels.");

  const numberOfLevels = 10;

  for (let i = 1; i <= numberOfLevels; i++) {
    const levelNumber = i;
    let originalScoreRequired = 0;
    if (levelNumber > 1) {
      originalScoreRequired = (levelNumber - 1) * 300;
    }

    // Decrease the points required by 250, ensuring it's not negative
    const adjustedScoreRequired = Math.max(0, originalScoreRequired - 250);

    const quizLevel = await prisma.quizLevel.create({
      data: {
        title: `Level ${levelNumber} Challenges`,
        number: levelNumber,
        unlockScoreRequired: adjustedScoreRequired, // Use adjusted score
      },
    });
    console.log(
      `Created quiz level: ID ${quizLevel.id}, Number ${quizLevel.number}, Title "${quizLevel.title}", UnlockScore ${quizLevel.unlockScoreRequired}`
    );

    try {
      const quiz = await prisma.quiz.create({
        data: {
          id: levelNumber,
          title: `Quiz for Level ${levelNumber}`,
          description: `Questions for level ${levelNumber}.`,
          quizLevelId: quizLevel.id,
          questions: {
            create: Array.from({ length: 10 }, (_, qIndex) => ({
              text: `Level ${levelNumber} - Question ${qIndex + 1}?`,
              options: {
                create: [
                  {
                    text: `L${levelNumber} Q${qIndex + 1} - OptA`,
                    isCorrect: true,
                  },
                  {
                    text: `L${levelNumber} Q${qIndex + 1} - OptB`,
                    isCorrect: false,
                  },
                ],
              },
            })),
          },
        },
      });
      console.log(
        `Created quiz with id: ${quiz.id} for QuizLevel id: ${quizLevel.id}`
      );
    } catch (e: any) {
      if (e.code === "P2002" && e.meta?.target?.includes("PRIMARY")) {
        console.warn(
          `Quiz with ID ${levelNumber} might already exist or manual ID setting failed. This quiz might not be created as intended.`
        );
      } else {
        console.error(`Failed to create quiz for level ${levelNumber}:`, e);
      }
    }
  }

  console.log(
    `Seeding finished: Created ${numberOfLevels} levels and associated quizzes.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
