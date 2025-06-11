import { auth } from "@/auth";
import LoginButton from "./components/buttons/loginBtn";
import LogoutButton from "./components/buttons/logoutBtn";

async function LoginPage() {
  const session = await auth();
  if (session) {
    const user = session.user;
    
    const displayName = user?.name ?? "Anonymous"; 
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 text-center">
          {/* Optional: Add Logo here if a dark version is available */}
          {/* <Image src="/path/to/dark_logo.png" alt="Guhuza Logo" width={150} height={50} className="mx-auto mb-6" /> */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Welcome Back!</h1>
          <p className="text-lg text-gray-700 mb-2">Hello, <span className="font-semibold">{displayName}</span></p>
          <p className="text-gray-600 mb-8">
            You are already logged in. If you want to log into another account, please log out first.
          </p>
          <div className="mt-6 w-full">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 text-center">
        {/* Optional: Add Logo here if a dark version is available */}
        {/* <Image src="/path/to/dark_logo.png" alt="Guhuza Logo" width={150} height={50} className="mx-auto mb-6" /> */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Log In</h1>
        <p className="text-gray-600 mb-8">
          Welcome to Guhuza’s Brain Boost! Authentication is handled by Guhuza.
        </p>
        <div className="mt-6 w-full">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
