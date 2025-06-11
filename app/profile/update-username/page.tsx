'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdateUsernamePage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    
    if (username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    try {
      const response = await fetch('/api/user/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update username.');
      } else {
        setMessage(data.message || 'Username updated successfully!');
        
        
        
        router.push('/profile'); 
        router.refresh(); 
      }
    } catch (err) {
      console.error('Update username error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Set Your Username</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Choose a Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              aria-describedby="username-description"
            />
            <p className="mt-2 text-xs text-gray-500" id="username-description">
              Must be 3-20 characters. Letters, numbers, and underscores only.
            </p>
          </div>

          {error && <p className="text-sm text-center p-3 bg-red-100 text-red-600 rounded-md">{error}</p>}
          {message && <p className="text-sm text-center p-3 bg-green-100 text-green-600 rounded-md">{message}</p>}

          <div>
            {/* Applying new primary button style */}
            <button
              type="submit"
              className="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Save Username
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
