import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

export default function Layout({ user, children }) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.reload(); // optional: refresh to reset state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Panel */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
        <Link to="/" className="text-lg font-bold">🎥 Stream Platform</Link>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Hi, {user?.displayName}</span>
          <img
            src={user?.photoURL}
            alt="Avatar"
            className="w-8 h-8 rounded-full border"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-4 bg-gray-100">{children}</main>
    </div>
  );
}
