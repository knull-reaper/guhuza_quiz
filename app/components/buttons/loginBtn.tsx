'use client'

import { useState } from 'react'
import { setCookie } from 'cookies-next'
import { useContext } from 'react'
import { playerContext } from '@/app/context/playerContext'
import { auth } from '@/auth'

export default function LoginButton() {
  
  const [isLoading, setIsLoading] = useState(false)
  const{player} = useContext(playerContext)
  const handleLogin = async () => {
    setIsLoading(true)
    const state = Math.random().toString(36).substring(2, 15)
    setCookie('loginState', state, { maxAge: 600, path: '/' }) 
    const loginUrl = new URL(`${process.env.NEXT_PUBLIC_GUHUZA_URL}/login`)
    loginUrl.searchParams.append('state', state)
    loginUrl.searchParams.append('redirect_uri', `${window.location.origin}/api/auth/callback/guhuza`)

    window.location.href = loginUrl.toString()
 

   
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      type="button" 
      className="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
        {isLoading ? 'Redirecting...' : 'Login with Guhuza'}
      </span>
    </button>
  )
}
