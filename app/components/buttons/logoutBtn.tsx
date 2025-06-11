'use client'

import { signOutHandler } from "../signout.action"

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        signOutHandler()
      }}
      type="button" 
      
      className="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
        Logout
      </span>
    </button>
  )
}
