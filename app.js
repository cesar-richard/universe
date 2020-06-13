console.log("Initializing");
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
      data.sensor === "black" &&
      data.state === "on"
    ) {
      s.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              action: "relay",
              on: false,
              relay: 1,
              macAddress: data.macAddress,
              time: data.time,
              target: "A4:CF:12:24:56:0C"
            })
          );
          client.send(
            JSON.stringify({
              action: "relay",
              on: false,
              relay: 2,
              macAddress: data.macAddress,
              time: data.time,
              target: "A4:CF:12:24:56:0C"
            })
          );
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "blue" &&
      data.state === "on"
    ) {
      s.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              action: "relay",
              on: true,
              relay: 2,
              macAddress: data.macAddress,
              time: data.time,
              target: "A4:CF:12:24:56:0C"
            })
          );
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "red" &&
      data.state === "on"
    ) {
      s.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              action: "relay",
              on: true,
              relay: 1,
              macAddress: data.macAddress,
              time: data.time,
              target: "A4:CF:12:24:56:0C"
            })
          );
        }
      });
    }
    ws.send(message);
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
server.listen(3657);
