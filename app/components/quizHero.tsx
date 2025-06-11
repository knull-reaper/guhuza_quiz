"use client"
import React from 'react'
import Image from 'next/image'
import Pbtn from './buttons/primarybtn'
import ShareButton from './buttons/sharebtn'

interface QuizHeroProps {
  startLevelNumber: number;
}

function QuizHero({ startLevelNumber }: QuizHeroProps) {
  
  
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
          <Pbtn message="Start Quiz" toDestination={`quiz/${startLevelNumber}`} theme="dark" />
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
