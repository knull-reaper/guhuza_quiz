import React from 'react'
import QuizList from '../components/quizList'
import fetchLevels from '@/utils/fLevels';
import Link from 'next/link';
import { auth } from '@/auth';
import fetchUser from '@/utils/fUser';
import { redirect } from 'next/navigation'; 






async function AllQuiz() {
    const levels = (await fetchLevels()) || []; 
    const session = await auth();

    if(session && session.user)  { 
      const user = session.user;
      
      const name = user?.name ?? "Anonymous";
      let userIdNumber: number | undefined = undefined;

      if (user?.id) {
        userIdNumber = parseInt(user.id, 10);
        if (isNaN(userIdNumber)) {
          console.error("AllQuizPage: Failed to parse user ID from session:", user.id);
          userIdNumber = undefined;
        }
      }

      
      let player = null;
      if (userIdNumber !== undefined) {
        player = await fetchUser(
            userIdNumber,
            name,
            user?.email || ""
          );
      }
      
      
      if (!player || !player.name || player.name === "Anonymous") {
        redirect('/profile/update-username');
      }

      
      const playerScore = player?.totalScore ?? 0;

      return (
        <div className='min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 py-12 px-4 sm:px-6 lg:px-8 text-white'>
          <div className="container mx-auto">
            <h1 className='text-4xl sm:text-5xl font-extrabold text-center mb-6 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]' id="title">All Quiz Levels</h1>
            <p className='text-lg text-gray-200 text-center mb-12 max-w-2xl mx-auto [text-shadow:_1px_1px_3px_rgb(0_0_0_/_50%)]'>
              Explore all available quiz levels. Test your knowledge and climb the ranks!
            </p>
            <QuizList allLevels={levels} cutEnding={false} playerTotalScore={playerScore}/> 
          </div>
        </div>
      )
    }
  
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 py-12 px-4 sm:px-6 lg:px-8 text-white'>
      <div className="container mx-auto">
        <h1 className='text-4xl sm:text-5xl font-extrabold text-center mb-6 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]' id="title">All Quiz Levels</h1>
        <p className='text-lg text-gray-200 text-center mb-12 max-w-2xl mx-auto [text-shadow:_1px_1px_3px_rgb(0_0_0_/_50%)]'>
          Browse all available quiz levels. Log in or sign up to track your progress and compete!
        </p>
        <QuizList allLevels={levels} cutEnding={false} playerTotalScore={0}/>
      </div>
    </div>
  )
}

export default AllQuiz
