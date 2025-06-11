import React from 'react';
import ProgressDisplay from '@/app/components/progressDisplay'; 
import { auth } from '@/auth'; 
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProgressPage() {
  const session = await auth();

  if (!session || !session.user) {
    
    
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your progress.</p>
          {/* Purple to Blue for "Log In" button */}
          <Link href="/api/auth/signin" legacyBehavior>
            <a className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent font-semibold">
                Log In
              </span>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-12">My Game Progress</h1>
        <ProgressDisplay />
      </div>
    </div>
  );
}
