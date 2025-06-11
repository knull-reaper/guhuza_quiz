/**
 * Calculates a speed bonus based on the time taken to answer a question.
 * The faster the answer, the higher the bonus.
 *
 * @param timeTakenSeconds Time taken to answer the question in seconds.
 * @param maxTimeSeconds Maximum allowed time for the question in seconds (e.g., 15s).
 * @param maxBonusPoints The maximum possible bonus points for speed.
 * @returns The calculated speed bonus points.
 */
export const calculateSpeedBonus = (
  timeTakenSeconds: number,
  maxTimeSeconds: number,
  maxBonusPoints: number = 50
): number => {
  if (timeTakenSeconds <= 0) return maxBonusPoints;
  if (timeTakenSeconds >= maxTimeSeconds) return 0;

  const timeRatio = timeTakenSeconds / maxTimeSeconds;
  const bonus = Math.round((1 - timeRatio) * maxBonusPoints);

  return Math.max(0, Math.min(bonus, maxBonusPoints));
};

/**
 * Calculates the star rating for a quiz based on the number of correct answers.
 *
 * @param correctAnswersCount Number of correctly answered questions.
 * @param totalQuestionsCount Total number of questions in the quiz.
 * @returns A star rating from 0 to 3.
 */
export const calculateStars = (
  correctAnswersCount: number,
  totalQuestionsCount: number
): 0 | 1 | 2 | 3 => {
  if (totalQuestionsCount === 0) return 0;

  const accuracy = correctAnswersCount / totalQuestionsCount;

  if (accuracy === 1) {
    return 3;
  } else if (accuracy >= 0.75) {
    return 2;
  } else if (accuracy >= 0.5) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * Calculates a bonus based on the current streak of consecutive correct answers.
 *
 * @param currentStreak The number of consecutive correct answers.
 * @param pointsPerStreakUnit Points awarded for each answer in the streak (e.g. 10 points).
 * @param maxStreakBonus Optional maximum cap for the streak bonus per question.
 * @returns The calculated streak bonus.
 */
export const calculateStreakBonus = (
  currentStreak: number,
  pointsPerStreakUnit: number = 10,
  maxStreakBonus?: number
): number => {
  if (currentStreak <= 0) return 0;

  let bonus = currentStreak * pointsPerStreakUnit;

  if (maxStreakBonus !== undefined) {
    bonus = Math.min(bonus, maxStreakBonus);
  }

  return bonus;
};
