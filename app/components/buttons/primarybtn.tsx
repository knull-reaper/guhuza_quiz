import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type PbtnType = {
  message: string;
  toDestination: string;
  theme?: "dark" | "light"; 
};

function Pbtn({ message, toDestination, theme = "light" }: PbtnType) {
  
  const isDark = theme === "dark"; 

  
  const outerClasses = `relative inline-flex items-center justify-center p-0.5 text-sm font-bold rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800`;
  const innerSpanClasses = `relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent`;

  
  
  
  
  

  return (
    <Link href={toDestination} className={`${outerClasses} text-gray-900`}> {/* Explicitly set initial text color for outer link if needed before hover */}
      <span className={`${innerSpanClasses} font-bold`}> {/* Apply font-bold to the message text */}
        {message}
      </span>
    </Link>
  );
}

export default Pbtn;
