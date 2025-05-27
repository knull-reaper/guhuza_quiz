import Qbtn from "@/app/components/buttons/quizbtn";

import { fetchQuiz } from "@/utils/fQuiz";
import QuizCard from "@/app/components/quizCard";
import QuizPageSection from "@/app/components/quizPageSection";
import fetchLevels from "@/utils/fLevels";
import fetchPlayers from "@/utils/fPlayers";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import { getCookie, setCookie } from "cookies-next";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;

  answers: string[];
};
type quizesType = {
  question: quizeType[];
};

export default async function Page({ params }: { params: { id: string } }) {


    const data = await fetchQuiz(params.id);
    const Quizes = data.test.question;

    let levels: any[] = [];
    try {
      levels = (await fetchLevels() || []);
    } catch (error) {
      console.error("Failed to fetch levels, proceeding with empty levels list:", error);
      // levels remains []
    }
    
    const levelNumber = params.id
    
    // Find the current level to get its title
    const currentLevel = levels.find((level: { Level_Id: number; Level_Title: string; Level_number: number; }) => String(level.Level_Id) === String(levelNumber));
    const levelTitle = currentLevel ? currentLevel.Level_Title : `Level ${levelNumber}`; // Fallback if level not found or levels fetch failed

    const session = await auth()

    const user = session && session?.user;
    const name =session ? user?.firstName == null ? "Anonymous" :user?.firstName : ""
    
    const player = session ? await fetchUser(
      Number(user?.memberId),
      name,
      user?.email || ""
    ) : {}

    return (
      <div>
     
        <QuizPageSection Quizes={Quizes} levelNumber = {levelNumber}  levelTitle = {levelTitle}  player={player} />
      </div>
    );
 
}
