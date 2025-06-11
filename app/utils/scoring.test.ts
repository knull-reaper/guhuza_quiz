import { describe, it, expect } from "vitest";
import {
  calculateSpeedBonus,
  calculateStars,
  calculateStreakBonus,
} from "./scoring";

describe("Scoring Utilities", () => {
  describe("calculateSpeedBonus", () => {
    it("should return max bonus for zero time taken", () => {
      expect(calculateSpeedBonus(0, 15, 50)).toBe(50);
    });

    it("should return zero bonus if time taken equals or exceeds max time", () => {
      expect(calculateSpeedBonus(15, 15, 50)).toBe(0);
      expect(calculateSpeedBonus(20, 15, 50)).toBe(0);
    });

    it("should calculate bonus proportionally", () => {
      expect(calculateSpeedBonus(7.5, 15, 50)).toBe(25);

      expect(calculateSpeedBonus(3.75, 15, 50)).toBe(38);

      expect(calculateSpeedBonus(11.25, 15, 50)).toBe(13);
    });

    it("should handle different maxBonusPoints", () => {
      expect(calculateSpeedBonus(7.5, 15, 100)).toBe(50);
    });

    it("should not return negative bonus or bonus greater than maxBonusPoints", () => {
      expect(calculateSpeedBonus(-5, 15, 50)).toBe(50);
    });
  });

  describe("calculateStars", () => {
    it("should return 0 stars for 0 total questions", () => {
      expect(calculateStars(0, 0)).toBe(0);
    });

    it("should return 3 stars for 100% accuracy", () => {
      expect(calculateStars(10, 10)).toBe(3);
    });

    it("should return 2 stars for accuracy >= 75% and < 100%", () => {
      expect(calculateStars(8, 10)).toBe(2);
      expect(calculateStars(15, 20)).toBe(2);
    });

    it("should return 1 star for accuracy >= 50% and < 75%", () => {
      expect(calculateStars(6, 10)).toBe(1);
      expect(calculateStars(10, 20)).toBe(1);
    });

    it("should return 0 stars for accuracy < 50%", () => {
      expect(calculateStars(4, 10)).toBe(0);
      expect(calculateStars(0, 10)).toBe(0);
    });
  });

  describe("calculateStreakBonus", () => {
    it("should return 0 bonus for 0 streak", () => {
      expect(calculateStreakBonus(0, 10)).toBe(0);
    });

    it("should calculate bonus linearly with pointsPerStreakUnit", () => {
      expect(calculateStreakBonus(1, 10)).toBe(10);
      expect(calculateStreakBonus(3, 10)).toBe(30);
      expect(calculateStreakBonus(5, 20)).toBe(100);
    });

    it("should cap bonus if maxStreakBonus is provided", () => {
      expect(calculateStreakBonus(10, 10, 50)).toBe(50);
      expect(calculateStreakBonus(3, 10, 50)).toBe(30);
    });

    it("should work if maxStreakBonus is not provided", () => {
      expect(calculateStreakBonus(10, 10)).toBe(100);
    });
  });
});
