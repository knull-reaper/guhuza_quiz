"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { playerContext } from "../context/playerContext";

function SignUp() {
  const router = useRouter();
  const { AssignPlayerData, tempScore, setTempScore} = useContext(playerContext)
  
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  
  const [showPassword, setShowPassword] = useState(false);

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("tiggered")
    setError("");
    setLoading(true);
    try {
      
      const reponse = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
          password,
          tempScore,
        }),
      });

      if (reponse.ok) {
        const data = await reponse.json()
        AssignPlayerData(data.player)
        setTempScore(0)
        router.push("/quiz");
        console.log("User created successfully!");
      } else {
        const errorData = await reponse.json();
        console.log(errorData.message);
      }

      setUsername("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        {/* Optional: Add Logo here if a dark version is available */}
        {/* <Image src="/path/to/dark_logo.png" alt="Guhuza Logo" width={150} height={50} className="mx-auto mb-6" /> */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Create New Account</h1>

        <form onSubmit={handleSignUp} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center p-3 bg-red-100 rounded-md">{error}</p>}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              placeholder="Enter Your Full Name"
              type="text"
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              name="username"
              placeholder="@YourUsername"
              type="text"
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            {/* Applying new primary button style */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                {loading ? "Signing up..." : "Sign Up"}
              </span>
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href={"/"} className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
