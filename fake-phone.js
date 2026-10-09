const WebSocket = require("ws");
const fs = require("fs");

const ws = new WebSocket("ws://localhost:3000/?role=phone&token=change-me");
ws.on("open", () => {
  console.log("fake phone connected");
  setInterval(() => ws.send(fs.readFileSync("test.jpg")), 1000);
});
