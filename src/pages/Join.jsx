import React, { useEffect, useRef } from "react";

const HOST_WS = "ws://localhost:5000";

export default function Join() {
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("sessionId");

    const ws = new WebSocket(HOST_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected as viewer");
      ws.send(JSON.stringify({ type: "watcher", sessionId }));
    };

    ws.onmessage = async ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.type === "offer") {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
        peerRef.current = pc;

        pc.ontrack = (event) => {
          videoRef.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            ws.send(JSON.stringify({
              type: "candidate",
              sessionId,
              targetId: msg.senderId,
              data: event.candidate
            }));
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        ws.send(JSON.stringify({
          type: "answer",
          sessionId,
          targetId: msg.senderId,
          data: answer
        }));
      } else if (msg.type === "candidate") {
        await peerRef.current?.addIceCandidate(new RTCIceCandidate(msg.data));
      } else if (msg.type === "end") {
        alert("Stream ended.");
        peerRef.current?.close();
      }
    };
  }, []);

  return (
    <div>
      <h2>👁 Viewer</h2>
      <video ref={videoRef} autoPlay playsInline controls style={{ width: "100%", background: "black" }} />
    </div>
  );
}
