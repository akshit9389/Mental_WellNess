// routes/room.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const { ExpressPeerServer } = require("peer");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(); // Use server instance created in your main app file
const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

// Redirect to a new room when accessing the /video route
router.get('/video', (req, res) => {
  res.redirect(`/${uuidv4()}`); // Redirect to a new room ID
});

// Render the room page
router.get('/:room', (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// Store users
const users = {}; // Map of socket IDs to user IDs

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (roomId, userId) => {
      console.log(`Joining room: ${roomId} with user: ${userId}`);
      socket.join(roomId);

      // Emit to all users in the room (including the new user)
      setTimeout(() => {
          console.log(`Emitting to room: ${roomId}`);
          io.to(roomId).emit("user-connected", userId);
      }, 1000);
  });

  socket.on("disconnect", () => {
      console.log("User Disconnected");
      const userId = users[socket.id]; // Retrieve the userId
      delete users[socket.id]; // Clean up the user record

      // Notify others in the room about the disconnection
      const roomId = Array.from(socket.rooms)[1]; // Get the roomId from the socket's rooms
      if (roomId) {
          io.to(roomId).emit("user-disconnected", userId); // Notify others in the room
      }
  });
});

module.exports = { router, server, io };
