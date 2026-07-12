function Message({ message, currentUsername }) {
  if (message.type === "system") {
    return (
      <div className="system-message">
        <span>{message.message}</span>
      </div>
    );
  }

  const isOwnMessage =
    message.username === currentUsername;

  return (
    <div
      className={`message-row ${
        isOwnMessage
          ? "own-message-row"
          : "other-message-row"
      }`}
    >
      <div
        className={`message-bubble ${
          isOwnMessage
            ? "own-message"
            : "other-message"
        }`}
      >
        {!isOwnMessage && (
          <p className="message-username">
            {message.username}
          </p>
        )}

        <p className="message-text">
          {message.message}
        </p>

        <span className="message-time">
          {message.time}
        </span>
      </div>
    </div>
  );
}

export default Message;