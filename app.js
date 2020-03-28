console.log("Initializing");
const Group = require("./Hue/Group");
var bodyParser = require("body-parser");
const express = require("express");
const app = express();
var http = require("http");
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);
const WebSocket = require("ws");
const s = new WebSocket.Server({ server });
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});
s.on("connection", function(ws, req) {
  ws.on("message", function(message) {
    console.log("Received: " + message);
    const data = JSON.parse(message);
    if (
      data.event === "button" &&
      data.sensor === "yellow" &&
      data.state === "on"
    ) {
      Group.action(0, {
        body: { scene: "HMo26dDghL9iHal" },
        callback: res => {
          console.log(res.raw_body);
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "black" &&
      data.state === "on"
    ) {
      Group.action(0, {
        body: { on: false },
        callback: res => {
          console.log(res.raw_body);
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "white" &&
      data.state === "on"
    ) {
      Group.action(0, {
        body: { on: true, bri: 255, xy: [0.3, 0.3] },
        callback: res => {
          console.log(res.raw_body);
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "blue" &&
      data.state === "on"
    ) {
      Group.list({
        callback: res => {
          console.log(res.raw_body);
        }
      });
    }
    s.clients.forEach(function(client) {
      if (client != ws && client.readyState) {
        client.send(message);
      }
    });
  });
  ws.on("close", function() {
    console.log("lost one client");
  });
  console.log("new client connected");
});
console.log("Listening");
server.listen(3000);
