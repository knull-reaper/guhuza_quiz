import prisma from "@/lib/prisma";
import type {
  User as PrismaUser,
  Milestone as PrismaMilestone,
} from "@prisma/client";

interface FetchedUserWithMilestone extends PrismaUser {
  milestone: PrismaMilestone | null;
}

type FetchedUsersWithMilestones = FetchedUserWithMilestone[];

async function fetchPlayers(): Promise<FetchedUsersWithMilestones | undefined> {
  try {
    const usersWithMilestones = await prisma.user.findMany({
      include: {
        milestone: true,
      },
    });

    return usersWithMilestones as FetchedUsersWithMilestones;
  } catch (e) {
    console.error("Error fetching players with milestones:", e);

    return undefined;
  }
}

export default fetchPlayers;
