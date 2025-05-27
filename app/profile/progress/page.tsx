import React from 'react';
import ProgressDisplay from '@/app/components/progressDisplay'; // Adjust path if necessary
import { auth } from '@/auth'; // For checking authentication
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProgressPage() {
  const session = await auth();

  if (!session || !session.user) {
    // Optional: Redirect to login or show a message
    // For now, let's redirect to login if not authenticated.
    // Or, show a message with a login link.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="mb-6">You need to be logged in to view your progress.</p>
        <Link href="/api/auth/signin" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Log In
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Game Progress</h1>
      <ProgressDisplay />
    </div>
  );
}
