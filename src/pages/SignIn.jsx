import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignIn({ onLogin }) {
  const handleSignIn = async () => {
    const { signInWithPopup, auth, provider } = await import("../firebase");
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err) {
      console.error(err);
      alert("Sign-in failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 text-white px-4">
      <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-8 sm:p-12 max-w-md w-full animate-fadeIn">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">🎬 Stream Platform</h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in with Google to continue and start your stream journey.
        </p>
        <button
          onClick={handleSignIn}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 hover:shadow-md transition rounded-lg px-5 py-3 font-medium text-gray-700"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>
        <p className="text-xs text-center mt-6 text-gray-400">
          By signing in, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}
