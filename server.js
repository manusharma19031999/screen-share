const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const TOKEN = process.env.TOKEN || "change-me";
const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  const q = new URL(req.url, "http://x").searchParams;
  if (q.get("token") !== TOKEN) return ws.close();
  ws.role = q.get("role"); // 'phone' or 'viewer'
  console.log("connected:", ws.role);

  ws.on("message", (data) => {
    if (ws.role !== "phone") return;
    wss.clients.forEach((c) => {
      if (c.role === "viewer" && c.readyState === WebSocket.OPEN) c.send(data);
    });
  });
});

server.listen(process.env.PORT || 3000, () => console.log("Server running"));
