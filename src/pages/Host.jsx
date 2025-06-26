import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const HOST_WS = "ws://localhost:5000";

export default function Host() {
  const [sessionId, setSessionId] = useState("");
  const wsRef = useRef(null);
  const peers = useRef({});
  const videoRef = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    const id = uuidv4();
    setSessionId(id);
    window.history.replaceState(null, "", `/host?sessionId=${id}`);

    const ws = new WebSocket(HOST_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to signaling server");
      ws.send(JSON.stringify({ type: "broadcaster", sessionId: id }));
    };

    ws.onmessage = async ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.type === "watcher") {
        const viewerId = msg.viewerId;
        const pc = createPeer(viewerId);
        peers.current[viewerId] = pc;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        ws.send(JSON.stringify({
          type: "offer",
          sessionId: id,
          targetId: viewerId,
          data: offer
        }));
      } else if (msg.type === "answer") {
        const pc = peers.current[msg.senderId];
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
        }
      } else if (msg.type === "candidate") {
        const pc = peers.current[msg.senderId];
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate(msg.data));
        }
      }
    };
  }, []);

  const createPeer = (viewerId) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current.send(JSON.stringify({
          type: "candidate",
          sessionId,
          targetId: viewerId,
          data: event.candidate
        }));
      }
    };

    localStream.current.getTracks().forEach(track => pc.addTrack(track, localStream.current));
    return pc;
  };

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      localStream.current = stream;
    } catch (err) {
      alert("❌ Cannot access screen: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center font-sans">
      <h2 className="text-3xl font-bold mb-4">📺 Host a Live Stream</h2>
      
      <div className="mb-3 text-sm">
        <span className="font-semibold">Session ID:</span>{" "}
        <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
      </div>

      <div className="mb-5 text-sm">
        <span className="font-semibold">Share link:</span><br />
        <code className="bg-blue-100 px-2 py-1 rounded inline-block mt-1 text-blue-600">
          {`${window.location.origin}/join?sessionId=${sessionId}`}
        </code>
      </div>

      <button
        onClick={startStream}
        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded transition mb-4"
      >
        📡 Start Screen Share
      </button>

      <div className="rounded overflow-hidden shadow bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
          style={{ minHeight: "300px", backgroundColor: "#000" }}
        />
      </div>
    </div>
  );
}
