import React from "react";
import Link from "next/link"; 
import QuizLevelSections from "../components/quizLevelSections";

import ProfileHerosection from "../components/profileHerosection";

import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import LoginButton from "../components/buttons/loginBtn";
import fetchRank from "@/utils/fRanking";
import { redirect } from 'next/navigation';
import ProgressDisplay from "../components/progressDisplay"; 

async function Profile() {
  const session = await auth();
  if (session && session.user) {
    const user = session.user;
    const name = user?.name ?? "Anonymous";
    let userIdNumber: number | undefined = undefined;

    if (user.id) {
      userIdNumber = parseInt(user.id, 10);
      if (isNaN(userIdNumber)) {
        console.error("ProfilePage: Failed to parse user ID from session:", user.id);
        userIdNumber = undefined;
      }
    }

    const player = userIdNumber !== undefined
      ? await fetchUser(
        userIdNumber,
        name,
        user?.email || ""
      )
      : null;

    const playerPoint: number = player ? player.totalScore : 0;
    const playerRank = player ? await fetchRank(playerPoint) : 100;
    

    if (!player) {
      return (
        <div className="flex h-full">
          <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
            <h1 className="text-2xl font-semibold mb-5">Profile Error</h1>
            <p>Could not load user profile. The user ID might be invalid or the user does not exist.</p>
            <div className="mt-5 w-full">
              <Link href="/" legacyBehavior><a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Go Home</a></Link>
            </div>
          </div>
        </div>
      );
    }

    if (!player.name || player.name === "Anonymous") {
      redirect('/profile/update-username');
    }

    return (
      <div className="flex flex-col items-center p-4 md:p-6 min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 dark:from-amber-800 dark:via-orange-800 dark:to-rose-900">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Grid Item 1: ProfileHerosection */}
          <div className="lg:col-span-1">
            <ProfileHerosection player={player} playerRank={playerRank} />
          </div>

          {/* Grid Item 2: "Track Your Growth" card now embeds ProgressDisplay */}
          <div className="lg:col-span-1 flex flex-col">
            {/* The outer div provides the card styling. ProgressDisplay itself is now content-only. Added hover animations including scale. */}
            <div className="bg-white p-6 rounded-xl shadow-xl w-full h-full flex flex-col border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Progress Snapshot</h3> {/* Title for the section */}
              <ProgressDisplay />
            </div>
          </div>

          {/* Grid Item 3: "Your Quiz Journey" section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-6 text-center text-slate-900 dark:text-slate-100">Your Quiz Journey</h2>
            <QuizLevelSections playerTotalScore={playerPoint} />
          </div>

          {/* Grid Item 4: "Community Rankings" link section - Added hover animations and ensured text is explicitly dark for contrast on white background in all modes */}
          <div className="lg:col-span-2 w-full text-center py-6 bg-white rounded-xl shadow-xl p-6 border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
            <h2 className="text-3xl font-semibold mb-4 text-center text-slate-900 dark:text-slate-900">Community Rankings</h2> {/* Explicitly dark text in light and dark mode */}
            <p className="text-gray-700 dark:text-gray-700 mb-6">See how you stack up against other players!</p> {/* Explicitly dark text in light and dark mode */}
            <Link href="/leaderboard" legacyBehavior>
              <a className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-8 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-base font-semibold">
                  View Full Leaderboard
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex h-full">
      <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
        <div className="">
          <h1 className="text-2xl font-semibold mb-5">Log in Required</h1>
          <p>You have to login in order to access this page.</p>
          <div className="mt-5 w-full">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
