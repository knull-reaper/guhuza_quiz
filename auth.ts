import NextAuth, { User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Member } from "./User.interface";
import prisma from "@/lib/prisma";

const DAILY_LOGIN_BONUS_POINTS = 50;

const areDatesConsecutive = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);

  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);

  const oneDay = 1000 * 60 * 60 * 24;
  return d2.getTime() - d1.getTime() === oneDay;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const credentialProvider = CredentialsProvider({
  name: "guhuza",
  credentials: {
    userId: { label: "User ID", type: "text" },
    token: { label: "Token", type: "text" },
  },
  async authorize(credentials): Promise<NextAuthUser | null> {
    if (credentials?.userId && credentials?.token) {
      const response = await fetch(
        `${process.env.GUHUZA_API}/member/${credentials.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${credentials.token}`,
          },
        }
      );
      const userFromApi = await response.json();
      if (response.ok && userFromApi) {
        return {
          id: userFromApi.memberId.toString(),
          memberId: userFromApi.memberId,
          firstName: userFromApi.firstName,
          lastName: userFromApi.lastName,
          email: userFromApi.emailAddress,
          name:
            userFromApi.firstName || userFromApi.lastName
              ? `${userFromApi.firstName || ""} ${
                  userFromApi.lastName || ""
                }`.trim()
              : null,
        } as NextAuthUser & Member;
      } else {
        return null;
      }
    }
    return null;
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [credentialProvider],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && token.sub && session.user) {
        session.user.id = token.sub;

        try {
          const userId = parseInt(token.sub);
          if (isNaN(userId)) {
            console.error(
              "User ID from token is not a valid number:",
              token.sub
            );
            return session;
          }

          let dbUser = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (dbUser) {
            const today = new Date();

            const dbLastLoginDate = dbUser.lastLogin
              ? new Date(dbUser.lastLogin)
              : null;

            console.log(
              `[Auth Session CB] User ID: ${userId}, DB lastLogin: ${dbLastLoginDate?.toISOString()}, Today: ${today.toISOString()}`
            );

            let newLoginStreak = dbUser.loginStreak;
            let newTotalScore = dbUser.totalScore;
            let shouldUpdateDb = false;

            if (dbLastLoginDate) {
              const is_same_day_result = isSameDay(dbLastLoginDate, today);
              console.log(
                `[Auth Session CB] Comparing lastLoginDate: ${dbLastLoginDate.toISOString()} with today: ${today.toISOString()}. Is same day? ${is_same_day_result}`
              );

              if (!is_same_day_result) {
                const are_consecutive_result = areDatesConsecutive(
                  dbLastLoginDate,
                  today
                );
                console.log(
                  `[Auth Session CB] Dates are not same. Are consecutive? ${are_consecutive_result}`
                );

                if (are_consecutive_result) {
                  newLoginStreak += 1;
                  newTotalScore += DAILY_LOGIN_BONUS_POINTS;
                  console.log(
                    `[Auth Session CB] Consecutive day bonus applied. New streak: ${newLoginStreak}, New score: ${newTotalScore}`
                  );
                } else {
                  newLoginStreak = 1;
                  console.log(
                    `[Auth Session CB] Non-consecutive new day. Streak reset to 1.`
                  );
                }
                shouldUpdateDb = true;
              }
            } else {
              console.log(
                `[Auth Session CB] First login for user ID: ${userId}. Setting initial streak.`
              );
              newLoginStreak = 1;

              shouldUpdateDb = true;
            }

            if (shouldUpdateDb) {
              console.log(
                `[Auth Session CB] Updating DB for user ID: ${userId} - lastLogin: ${today.toISOString()}, streak: ${newLoginStreak}, score: ${newTotalScore}`
              );
              dbUser = await prisma.user.update({
                where: { id: userId },
                data: {
                  lastLogin: today,
                  loginStreak: newLoginStreak,
                  totalScore: newTotalScore,
                },
              });
            }

            session.user.loginStreak = dbUser.loginStreak;
            session.user.totalScore = dbUser.totalScore;
            session.user.name = dbUser.name ?? session.user.name;
            session.user.image = dbUser.image ?? session.user.image;
          } else {
            console.error(
              `User with id ${userId} (from token.sub) not found in Prisma DB.`
            );
            session.user.loginStreak = 0;
            session.user.totalScore = 0;
          }
        } catch (error) {
          console.error(
            "Error in session callback (daily login logic):",
            error
          );
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
});
