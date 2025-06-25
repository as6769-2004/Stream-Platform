import React, { useRef, useState } from "react";

export default function Host({ user }) {
  const [streamType, setStreamType] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startStream = async (type) => {
    try {
      let mediaStream;
      if (type === "camera") {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } else if (type === "screen") {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      streamRef.current = mediaStream;
      setStreamType(type);
    } catch (err) {
      console.error("Error accessing media devices:", err.name, err.message);
      alert(`Error: ${err.name} - ${err.message}`);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setStreamType(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Hello, {user?.displayName} 👋
      </h1>
      <p className="text-gray-600 mb-6">You're now on the Host Stream page.</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => startStream("camera")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow"
        >
          Use Camera
        </button>
        <button
          onClick={() => startStream("screen")}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded shadow"
        >
          Share Screen
        </button>
        {streamType && (
          <button
            onClick={stopStream}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded shadow"
          >
            Stop Stream
          </button>
        )}
      </div>

      {streamType && (
        <div className="w-full max-w-3xl border rounded shadow">
          <video
            ref={videoRef}
            className="w-full rounded"
            autoPlay
            muted
            playsInline
          />
        </div>
      )}
    </div>
  );
}
