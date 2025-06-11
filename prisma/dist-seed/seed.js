"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    var _a, _b;
    console.log(`Start seeding ...`);
    // Clean up existing levels and quizzes to avoid conflicts if IDs are hardcoded
    // Note: In production, you wouldn't typically delete like this.
    // This is for easily re-runnable development seeding.
    await prisma.quiz.deleteMany({});
    await prisma.quizLevel.deleteMany({});
    console.log("Deleted existing quizzes and quiz levels.");
    const numberOfLevels = 10;
    for (let i = 1; i <= numberOfLevels; i++) {
        const levelNumber = i;
        let scoreRequired = 0;
        if (levelNumber > 1) {
            scoreRequired = (levelNumber - 1) * 500; // Example: Level 2 needs 500, Level 3 needs 1000, etc.
        }
        const quizLevel = await prisma.quizLevel.create({
            data: {
                // id: levelNumber, // Let Prisma auto-generate QuizLevel IDs
                title: `Level ${levelNumber} Challenges`,
                number: levelNumber,
                unlockScoreRequired: scoreRequired,
            },
        });
        console.log(`Created quiz level: ID ${quizLevel.id}, Number ${quizLevel.number}, Title "${quizLevel.title}", UnlockScore ${quizLevel.unlockScoreRequired}`);
        try {
            const quiz = await prisma.quiz.create({
                data: {
                    id: levelNumber, // Attempting to set Quiz ID to match level number for simplicity
                    title: `Quiz for Level ${levelNumber}`,
                    description: `Questions for level ${levelNumber}.`,
                    quizLevelId: quizLevel.id, // Link to the QuizLevel created above
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
            console.log(`Created quiz with id: ${quiz.id} for QuizLevel id: ${quizLevel.id}`);
        }
        catch (e) {
            if (e.code === "P2002" && ((_b = (_a = e.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("PRIMARY"))) {
                console.warn(`Quiz with ID ${levelNumber} might already exist or manual ID setting failed. This quiz might not be created as intended.`);
            }
            else {
                console.error(`Failed to create quiz for level ${levelNumber}:`, e);
            }
        }
    }
    console.log(`Seeding finished: Created ${numberOfLevels} levels and associated quizzes.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
