import prisma from "@/lib/prisma";

const fetchRank = async (playerpoint: number) => {
  const rank =
    (await prisma.user.count({
      where: {
        totalScore: { gt: playerpoint },
      },
    })) + 1;
  return rank;
};
export default fetchRank;
