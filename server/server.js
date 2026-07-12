require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDatabase = require("./config/db");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

const rooms = {};

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SyncTalk server is running",
  });
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", async ({ username, roomId }) => {
    try {
      socket.join(roomId);

      socket.data.username = username;
      socket.data.roomId = roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      const userAlreadyExists = rooms[roomId].some(
        (user) => user.socketId === socket.id
      );

      if (!userAlreadyExists) {
        rooms[roomId].push({
          socketId: socket.id,
          username,
        });
      }

      const previousMessages = await Message.find({
        roomId,
      })
        .sort({ createdAt: 1 })
        .limit(100)
        .lean();

      const formattedMessages = previousMessages.map(
        (message) => ({
          id: message.messageId,
          roomId: message.roomId,
          username: message.username,
          message: message.message,
          time: message.time,
          type: message.type,
        })
      );

      socket.emit(
        "previous_messages",
        formattedMessages
      );

      io.to(roomId).emit(
        "online_users",
        rooms[roomId]
      );

      socket.to(roomId).emit("user_joined", {
        username,
        message: `${username} joined the room`,
      });

      console.log(
        `${username} joined room: ${roomId}`
      );
    } catch (error) {
      console.error(
        `Join room error: ${error.message}`
      );

      socket.emit("chat_error", {
        message:
          "Unable to join the room. Please try again.",
      });
    }
  });

  socket.on("send_message", async (messageData) => {
    try {
      const savedMessage = await Message.create({
        messageId: messageData.id,
        roomId: messageData.roomId,
        username: messageData.username,
        message: messageData.message,
        time: messageData.time,
        type: "user",
      });

      const responseMessage = {
        id: savedMessage.messageId,
        roomId: savedMessage.roomId,
        username: savedMessage.username,
        message: savedMessage.message,
        time: savedMessage.time,
        type: savedMessage.type,
      };

      socket
        .to(messageData.roomId)
        .emit("receive_message", responseMessage);
    } catch (error) {
      console.error(
        `Save message error: ${error.message}`
      );

      socket.emit("message_error", {
        message:
          "Message could not be saved. Please try again.",
        temporaryId: messageData.id,
      });
    }
  });

  socket.on(
    "typing_start",
    ({ username, roomId }) => {
      socket.to(roomId).emit("user_typing", {
        username,
      });
    }
  );

  socket.on("typing_stop", ({ roomId }) => {
    socket
      .to(roomId)
      .emit("user_stopped_typing");
  });

  socket.on("leave_room", () => {
    removeUserFromRoom(socket);
  });

  socket.on("disconnect", () => {
    removeUserFromRoom(socket);

    console.log(
      `User disconnected: ${socket.id}`
    );
  });
});

function removeUserFromRoom(socket) {
  const { username, roomId } = socket.data;

  if (!username || !roomId || !rooms[roomId]) {
    return;
  }

  rooms[roomId] = rooms[roomId].filter(
    (user) => user.socketId !== socket.id
  );

  socket.leave(roomId);

  socket.to(roomId).emit("user_left", {
    username,
    message: `${username} left the room`,
  });

  io.to(roomId).emit(
    "online_users",
    rooms[roomId]
  );

  if (rooms[roomId].length === 0) {
    delete rooms[roomId];
  }

  socket.data.username = null;
  socket.data.roomId = null;
}

const startServer = async () => {
  await connectDatabase();

  server.listen(PORT, () => {
    console.log(
      `SyncTalk server running on http://localhost:${PORT}`
    );
  });
};

startServer();