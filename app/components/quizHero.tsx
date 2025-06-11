"use client"
import React from 'react'
import Image from 'next/image'
import Pbtn from './buttons/primarybtn' // Will be replaced by a regular button for Start Quiz
import ShareButton from './buttons/sharebtn'
import { useRouter } from 'next/navigation'; // For navigation fallback if needed, or direct use

interface QuizHeroProps {
  startLevelNumber: number;
  onStartQuiz: () => void; // New prop
}

function QuizHero({ startLevelNumber, onStartQuiz }: QuizHeroProps) {
  
  
  return (
    <div className="container mx-auto px-4 py-16 bg-white shadow-lg rounded-lg"> {/* Added shadow and rounded-lg for a card-like feel */}
      <div className="flex flex-col md:flex-row items-center">
        {/* Text Section */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left md:pr-8 lg:pr-12"> {/* Added right padding for text section */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-800 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Level Up Your Job Search with Guhuza’s Brain Boost
        </h1>

        <p className="text-gray-600 text-lg intersect:motion-preset-slide-up motion-delay-300 intersect-once">
          A fun and interactive way to sharpen your skills, earn rewards,
          and stand out in your career journey. Compete, learn, and win as
          you take your job search to the next level!
        </p>

        {/* Buttons */}
        <div className="flex justify-center md:justify-start space-x-4 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          {/* Replaced Pbtn with a regular button for custom onClick logic */}
          <button
            type="button" // Added type
            onClick={onStartQuiz}
            className="relative inline-flex items-center justify-center p-0.5 text-sm font-bold rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white text-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" // Added dark:text-white
          >
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent font-bold">
              Start Quiz
            </span>
          </button>
          <ShareButton/>
        </div>
      </div>

      {/* Image Section */}
      <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
        <Image
          src="/Images/herosection/heroimage.webp"
          alt="A person giving an interview and smiling"
          className="rounded-md shadow-lg w-full hidden lg:max-w-lg md:block intersect:motion-preset-blur-right-sm motion-delay-200 intersect-once "
          width={500}
          height={300}
          priority 
        />
      </div>
    </div>
  </div>
  )
}

export default QuizHero
