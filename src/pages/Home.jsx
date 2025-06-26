import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
  const navigate = useNavigate();
  console.log("User object:", user);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <img
        src={user.photoURL || "https://via.placeholder.com/150"}
        alt="Avatar"
        className="w-20 h-20 rounded-full mb-4 shadow"
      />
      <h2 className="text-2xl font-bold mb-2">
        Welcome, {user.displayName} 👋
      </h2>
      <p className="mb-6 text-gray-600">What would you like to do today?</p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/host")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
        >
          Host a Stream
        </button>
        <button
          onClick={() => alert("Join feature coming soon")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
        >
          Join a Stream
        </button>
      </div>
    </div>
  );
}
