function OnlineUsers({ users, currentUsername }) {
  return (
    <aside className="online-users-panel">
      <div className="online-users-header">
        <h2>Online Users</h2>

        <span className="online-users-count">
          {users.length}
        </span>
      </div>

      <div className="online-users-list">
        {users.map((user) => {
          const isCurrentUser =
            user.username === currentUsername;

          return (
            <div
              className="online-user"
              key={user.socketId}
            >
              <div className="online-user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className="online-user-details">
                <p>
                  {user.username}
                  {isCurrentUser && (
                    <span className="you-label">You</span>
                  )}
                </p>

                <span>
                  <span className="small-online-dot"></span>
                  Active now
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default OnlineUsers;