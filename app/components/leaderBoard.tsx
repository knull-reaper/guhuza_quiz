import { auth } from "@/auth";
import fetchPlayers from "@/utils/fPlayers";
import fetchRank from "@/utils/fRanking";
import fetchUser from "@/utils/fUser";
import Image from "next/image"; 



export default async function LeaderBoard() {
  
  const Players = (await fetchPlayers()) || []; 
  const session = await auth();
  const user = session?.user;

  
  const name = user?.name ?? "Anonymous";
  let userIdNumber: number | undefined = undefined;
  if (user?.id) {
    userIdNumber = parseInt(user.id, 10);
    if (isNaN(userIdNumber)) {
      console.error("LeaderBoard: Failed to parse user ID from session:", user.id);
      userIdNumber = undefined;
    }
  }

  const player = userIdNumber !== undefined && session ? await fetchUser(
    userIdNumber,
    name,
    user?.email || ""
  ) : null;

  
  const playerId = player?.id ?? null;
  const rank = player?.totalScore !== undefined ? await fetchRank(player.totalScore) : 100;

  
  
  
  const sortedPlayers = [...Players]?.sort(
    (a, b) => (b?.totalScore ?? 0) - (a?.totalScore ?? 0)
  );
  
  let topPlayers = sortedPlayers?.slice(0, 5);
  
  
  const isPlayerInTop5 = topPlayers?.some((p) => p?.id === playerId);

  
  if (playerId !== null && !isPlayerInTop5) {
    const currentPlayerFromFullList = Players?.find((p) => p?.id === playerId);
    if (currentPlayerFromFullList) {
      topPlayers.push(currentPlayerFromFullList);
    }
  }

  return (
    <div className="w-full">
      {/* Title and description are handled by parent components (app/profile/page.tsx and LeaderBoardSection.tsx) */}
      {/* <div className="container">
        <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto intersect:motion-preset-slide-up motion-delay-200 intersect-once ">
          LeaderBoard
        </h2>
      
        <p className="w-96 m-auto text-center mt-6 mb-10 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Check our top performers
        </p>
      </div> */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topPlayers.map((playerData, index) => {
              const isCurrentPlayer = playerData?.id === playerId;
              const leaderBoardRank = isCurrentPlayer ? rank : index + 1;
              const rowClass = isCurrentPlayer
                ? "bg-blue-50 font-semibold text-blue-700"
                : "hover:bg-gray-50";

              return (
                <tr
                  key={playerData?.id}
                  className={`${rowClass} transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      {leaderBoardRank === 1 && (
                        <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/512.gif" alt="Gold Trophy" width={32} height={32} unoptimized={true} className="mr-2"/>
                      )}
                      {leaderBoardRank === 2 && (
                        <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f948/512.gif" alt="Silver Medal" width={32} height={32} unoptimized={true} className="mr-2"/>
                      )}
                      {leaderBoardRank === 3 && (
                        <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f949/512.gif" alt="Bronze Medal" width={32} height={32} unoptimized={true} className="mr-2"/>
                      )}
                      {leaderBoardRank === 4 && (
                         <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f38a/512.gif" alt="Confetti Ball" width={32} height={32} unoptimized={true} className="mr-2"/>
                      )}
                      {leaderBoardRank === 5 && (
                         <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="Party Popper" width={32} height={32} unoptimized={true} className="mr-2"/>
                      )}
                       {/* Display rank number for all */}
                      <span>{leaderBoardRank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {playerData?.name ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {playerData?.totalScore ?? 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {playerData?.quizLevelId ?? "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
