import prisma from "@/lib/prisma";

type TypeUserParams = {
  userid: number;
  username: string | null;
  email: string;
};

const fetchUser = async (
  userid: number,
  usernameParam: string | null,
  email: string
) => {
  console.log(
    `fetchUser called with userid: ${userid}, type: ${typeof userid}, usernameParam: ${usernameParam}, email: ${email}`
  );

  const playerexist = await prisma.user.findUnique({
    where: {
      id: userid,
    },
    include: {
      milestone: true,
    },
  });

  if (playerexist) {
    let dataToUpdate: { name?: string } = {};
    let needsUpdate = false;

    const currentDbName = playerexist.name;
    if (usernameParam && usernameParam !== "Anonymous") {
      if (currentDbName !== usernameParam) {
        dataToUpdate.name = usernameParam;
        needsUpdate = true;
      }
    } else if (
      (currentDbName === "Anonymous" || currentDbName === null) &&
      usernameParam &&
      usernameParam !== "Anonymous"
    ) {
      dataToUpdate.name = usernameParam;
      needsUpdate = true;
    }

    if (needsUpdate) {
      const updatedPlayer = await prisma.user.update({
        where: { id: userid },
        data: dataToUpdate,
        include: { milestone: true },
      });
      return updatedPlayer;
    }
    return playerexist;
  } else {
    console.log(
      `[fetchUser] User with ID ${userid} not found. Creating new user.`
    );
    const currentDate = new Date();
    const nameForNewUser = usernameParam;

    const newPlayer = await prisma.user.create({
      data: {
        id: Number(userid),
        name: nameForNewUser,
        email: email,
        totalScore: 0,
        quizLevelId: null,
        milestoneId: null,
        lastLogin: currentDate,
        loginStreak: 1,
        currentStreak: 0,
      },
      include: {
        milestone: true,
      },
    });
    console.log(
      `[fetchUser] New user created with ID: ${newPlayer.id}, Name: ${newPlayer.name}`
    );
    return newPlayer;
  }
};

export default fetchUser;
