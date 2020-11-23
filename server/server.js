const express = require("express");
const app = express();
const http = require('http').createServer(app)
const socketIo = require("socket.io");
const router = express.Router();

const guid = require("./guid");

// Hashmaps
const clients = {};


// Create Socket.io with CORS
const io = require("socket.io")(http, {
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
  console.log("New client connected: " + id);
  socket.emit("ClientId", id);

  socket.on("disconnect", () => {
    socket.leave(roomId);
    console.log("Client disconnected");
  });

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit("newChatMessage", data);
  });
});

http.listen(4000, () => console.log(`Listening on port 4000`));
