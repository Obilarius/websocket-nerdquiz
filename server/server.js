const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const router = express.Router();
const app = express();
const server = http.createServer(app);
const guid = require("./guid");

// Hashmaps
const clients = {};

// Create Socket.io with CORS
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// router.get("/", (req, res) => {
//   console.log("Get Root");
//   res.send({ response: "I am alive" }).status(200);
// });

io.on("connection", (socket) => {
  const id = guid();
  clients[id] = {
    socket,
  };
  console.log("New client connected: " + id);
  socket.emit("ClientId", id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("ChatMessage", (msg) => {
    console.log("message: " + msg);
    io.emit("ChatMessage", msg); // This will emit the event to all connected sockets
  });
});

server.listen(4000, () => console.log(`Listening on port 4000`));
