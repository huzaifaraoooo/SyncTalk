import { useState } from "react";
import { io } from "socket.io-client";
import JoinChat from "./components/JoinChat";
import ChatRoom from "./components/ChatRoom";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const joinRoom = () => {
    const cleanUsername = username.trim();
    const cleanRoomId = roomId.trim();

    if (!cleanUsername || !cleanRoomId) {
      alert("Please enter your name and room ID.");
      return;
    }

    socket.emit("join_room", {
      username: cleanUsername,
      roomId: cleanRoomId,
    });

    setUsername(cleanUsername);
    setRoomId(cleanRoomId);
    setIsJoined(true);
  };

  const leaveRoom = () => {
    setIsJoined(false);
    setRoomId("");
  };

  return (
    <main className="app">
      {!isJoined ? (
        <JoinChat
          username={username}
          roomId={roomId}
          setUsername={setUsername}
          setRoomId={setRoomId}
          joinRoom={joinRoom}
        />
      ) : (
        <ChatRoom
          socket={socket}
          username={username}
          roomId={roomId}
          leaveRoom={leaveRoom}
        />
      )}
    </main>
  );
}

export default App;