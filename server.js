const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const hosts = {}; // sessionId -> hostSocket
const viewers = {}; // sessionId -> [viewerSockets]

wss.on("connection", (socket) => {
  socket.id = uuidv4();

  socket.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      const { type, sessionId, targetId } = data;

      if (type === "broadcaster") {
        hosts[sessionId] = socket;
        socket.sessionId = sessionId;
        console.log("📡 Host joined session:", sessionId);
      }

      if (type === "watcher") {
        if (!viewers[sessionId]) viewers[sessionId] = [];
        viewers[sessionId].push(socket);
        socket.sessionId = sessionId;
        socket.isViewer = true;

        const host = hosts[sessionId];
        if (host && host.readyState === WebSocket.OPEN) {
          host.send(JSON.stringify({ type: "watcher", viewerId: socket.id }));
        }
      }

      if (["offer", "answer", "candidate"].includes(type)) {
        const target = findClientById(targetId);
        if (target && target.readyState === WebSocket.OPEN) {
          target.send(JSON.stringify({ type, senderId: socket.id, data: data.data }));
        }
      }
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
    }
  });

  socket.on("close", () => {
    const { sessionId } = socket;
    if (!sessionId) return;

    if (socket.isViewer) {
      viewers[sessionId] = (viewers[sessionId] || []).filter(s => s !== socket);
    } else {
      delete hosts[sessionId];
      (viewers[sessionId] || []).forEach(v =>
        v.send(JSON.stringify({ type: "end", reason: "host disconnected" }))
      );
      delete viewers[sessionId];
    }
  });
});

function findClientById(id) {
  for (const client of wss.clients) {
    if (client.id === id) return client;
  }
  return null;
}

server.listen(5000, () => console.log("🚀 WebSocket signaling server at ws://localhost:5000"));
