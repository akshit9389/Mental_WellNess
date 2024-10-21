const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const socketIo = require("socket.io");
const { ExpressPeerServer } = require("peer");
const mongoose = require("mongoose");
const User = require("./models/user");
const MONGO_URL = "mongodb://127.0.0.1:27017/Moodmap"; // Update this to your connection string

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the database"))
  .catch(err => console.error("Database connection error:", err));

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

// Set view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Set up PeerJS
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.use("/peerjs", peerServer);

// Redirect to a new room when accessing the root
app.get('/video', (req, res) => {
  const role = req.query.role;
  // Get the user role from query parameter
  console.log(role);
  const roomId = uuidv4(); // Generate a new room ID

  if (role === 'doctor') {
    // Store the roomId and notify users (if any)
    console.log(`Doctor has joined room: ${roomId}`);
    res.redirect(`/${roomId}?role=doctor`); // Redirect the doctor to their room
  } else {
    res.redirect(`/${roomId}?role=user`); // Redirect regular users to their room
  }
});

// Render the room page
app.get('/:room', (req, res) => {
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
          io.to(roomId).emit("user-connected", userId); // Change here
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


// Start the server
const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
