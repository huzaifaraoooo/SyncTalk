import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import OnlineUsers from "./OnlineUsers";

function ChatRoom({
  socket,
  username,
  roomId,
  leaveRoom,
}) {
  const [currentMessage, setCurrentMessage] =
    useState("");

  const [messages, setMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typingUser, setTypingUser] = useState("");

  const [chatError, setChatError] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const sendMessage = () => {
    const cleanMessage = currentMessage.trim();

    if (!cleanMessage) {
      return;
    }

    const messageData = {
      id: crypto.randomUUID(),
      roomId,
      username,
      message: cleanMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "user",
    };

    socket.emit("send_message", messageData);

    setMessages((previousMessages) => [
      ...previousMessages,
      messageData,
    ]);

    setCurrentMessage("");
    setChatError("");

    socket.emit("typing_stop", {
      roomId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleMessageChange = (event) => {
    const value = event.target.value;

    setCurrentMessage(value);

    if (!value.trim()) {
      socket.emit("typing_stop", {
        roomId,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      return;
    }

    socket.emit("typing_start", {
      username,
      roomId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", {
        roomId,
      });
    }, 1000);
  };

  const handleLeaveRoom = () => {
    socket.emit("typing_stop", {
      roomId,
    });

    socket.emit("leave_room");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessages([]);
    setOnlineUsers([]);
    setTypingUser("");
    setChatError("");

    leaveRoom();
  };

  useEffect(() => {
    const loadPreviousMessages = (savedMessages) => {
      setMessages(
        Array.isArray(savedMessages)
          ? savedMessages
          : []
      );
    };

    const receiveMessage = (messageData) => {
      setMessages((previousMessages) => {
        const messageAlreadyExists =
          previousMessages.some(
            (message) => message.id === messageData.id
          );

        if (messageAlreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, messageData];
      });

      setTypingUser("");
      setChatError("");
    };

    const updateOnlineUsers = (users) => {
      setOnlineUsers(
        Array.isArray(users) ? users : []
      );
    };

    const handleUserJoined = (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: crypto.randomUUID(),
          message: data.message,
          type: "system",
        },
      ]);
    };

    const handleUserLeft = (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: crypto.randomUUID(),
          message: data.message,
          type: "system",
        },
      ]);

      setTypingUser((currentTypingUser) =>
        currentTypingUser === data.username
          ? ""
          : currentTypingUser
      );
    };

    const handleUserTyping = ({
      username: typingUsername,
    }) => {
      setTypingUser(typingUsername);
    };

    const handleUserStoppedTyping = () => {
      setTypingUser("");
    };

    const handleChatError = (errorData) => {
      setChatError(
        errorData?.message ||
          "Something went wrong. Please try again."
      );
    };

    const handleMessageError = (errorData) => {
      setChatError(
        errorData?.message ||
          "Message could not be saved."
      );

      if (!errorData?.temporaryId) {
        return;
      }

      setMessages((previousMessages) =>
        previousMessages.filter(
          (message) =>
            message.id !== errorData.temporaryId
        )
      );
    };

    socket.on(
      "previous_messages",
      loadPreviousMessages
    );

    socket.on(
      "receive_message",
      receiveMessage
    );

    socket.on(
      "online_users",
      updateOnlineUsers
    );

    socket.on(
      "user_joined",
      handleUserJoined
    );

    socket.on(
      "user_left",
      handleUserLeft
    );

    socket.on(
      "user_typing",
      handleUserTyping
    );

    socket.on(
      "user_stopped_typing",
      handleUserStoppedTyping
    );

    socket.on(
      "chat_error",
      handleChatError
    );

    socket.on(
      "message_error",
      handleMessageError
    );

    return () => {
      socket.off(
        "previous_messages",
        loadPreviousMessages
      );

      socket.off(
        "receive_message",
        receiveMessage
      );

      socket.off(
        "online_users",
        updateOnlineUsers
      );

      socket.off(
        "user_joined",
        handleUserJoined
      );

      socket.off(
        "user_left",
        handleUserLeft
      );

      socket.off(
        "user_typing",
        handleUserTyping
      );

      socket.off(
        "user_stopped_typing",
        handleUserStoppedTyping
      );

      socket.off(
        "chat_error",
        handleChatError
      );

      socket.off(
        "message_error",
        handleMessageError
      );

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  return (
    <section className="chat-page">
      <div className="chat-layout">
        <div className="chat-container">
          <header className="chat-header">
            <div className="chat-user-info">
              <div className="chat-avatar">
                {username.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1>SyncTalk</h1>

                <p>
                  Room: <span>{roomId}</span>
                </p>
              </div>
            </div>

            <div className="chat-header-actions">
              <div className="online-status">
                <span className="online-dot"></span>
                {onlineUsers.length} Online
              </div>

              <button
                type="button"
                className="leave-button"
                onClick={handleLeaveRoom}
              >
                Leave Room
              </button>
            </div>
          </header>

          {chatError && (
            <div className="chat-error-message">
              {chatError}
            </div>
          )}

          <div className="messages-container">
            {messages.length === 0 && !typingUser ? (
              <div className="empty-chat">
                <div className="empty-chat-icon">
                  💬
                </div>

                <h2>No messages yet</h2>

                <p>
                  Start the conversation by sending
                  your first message.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  currentUsername={username}
                />
              ))
            )}

            {typingUser && (
              <div className="typing-indicator">
                <div className="typing-avatar">
                  {typingUser
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="typing-content">
                  <span>
                    {typingUser} is typing
                  </span>

                  <div className="typing-dots">
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <form
            className="message-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={handleMessageChange}
              autoComplete="off"
              maxLength={1000}
            />

            <button
              type="submit"
              className="send-button"
              disabled={!currentMessage.trim()}
            >
              <span>Send</span>
              <span className="send-icon">➤</span>
            </button>
          </form>
        </div>

        <OnlineUsers
          users={onlineUsers}
          currentUsername={username}
        />
      </div>
    </section>
  );
}

export default ChatRoom;