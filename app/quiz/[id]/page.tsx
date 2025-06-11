import Qbtn from "@/app/components/buttons/quizbtn";

import { fetchQuiz } from "@/utils/fQuiz";
import QuizCard from "@/app/components/quizCard";
import QuizPageSection from "@/app/components/quizPageSection";
import fetchLevels from "@/utils/fLevels";

import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import { redirect } from 'next/navigation'; 



type quizeType = {
  question: string;
  comment: string;
  test_answer: number;
  answers: string[];
};
type quizesType = {
  question: quizeType[];
};


interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const data = await fetchQuiz(params.id);
  const Quizes = data.test.question; 

  let levels: Array<{ id: number; title: string; number: number }> = []; 
  try {
    levels = (await fetchLevels()) || [];
  } catch (error) {
    console.error(
      "Failed to fetch levels, proceeding with empty levels list:",
      error
    );
  }

  const levelIdStrFromParams = params.id; 

  
  const currentLevelData = levels.find(
    (level) => String(level.id) === levelIdStrFromParams
  );
  const levelTitle = currentLevelData
    ? currentLevelData.title
    : `Quiz ${levelIdStrFromParams}`; 

  const session = await auth();
  let player = null; 

  if (session && session.user) {
    const user = session.user;
    
    const name = user?.name ?? "Anonymous"; 
    let userIdNumber: number | undefined = undefined;

    if (user?.id) {
      userIdNumber = parseInt(user.id, 10);
      if (isNaN(userIdNumber)) {
        console.error(
          "QuizPage [id]: Failed to parse user ID from session:",
          user.id
        );
        userIdNumber = undefined; 
      }
    }

    
    if (userIdNumber !== undefined) {
      player = await fetchUser(userIdNumber, name, user?.email || "");
    }

    
    if (!player || !player.name || player.name === "Anonymous") {
      redirect('/profile/update-username');
    }
    
  } else {
    
    
    redirect('/api/auth/signin'); 
  }


  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* QuizPageSection will likely manage its own max-width and specific layout */}
      <QuizPageSection
        Quizes={Quizes}
        levelNumber={levelIdStrFromParams} 
        levelTitle={levelTitle}
        player={player} 
      />
    </div>
  );
}
