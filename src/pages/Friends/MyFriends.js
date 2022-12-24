import React from "react";

const MyFriends = ({ socket, users, setUsers, user, setSelectedUser }) => {
  const findUser = React.useCallback((userId) => {
    const userIndex = users.findIndex((user) => user._id === userId);
    return userIndex >= 0;
  }, [users]);

  const handleConnectionStatus = React.useCallback((userId, status) => {
    const userIndex = users.findIndex((u) => u._id === userId);
    if (userIndex >= 0) {
      users[userIndex].connected = status;
      setUsers([...users])
    }
  },  [users, setUsers]);

  const onUserConnected = React.useCallback((userId, username) => {
    if (user._id !== userId) {
        const userExists = findUser(userId);
        if (userExists) {
          handleConnectionStatus(userId, true);
        } else {
          const newUser = { _id: userId, userId: userId, username, connected: true };
          setUsers([...users, newUser])
        }
    }
  }, [findUser,setUsers, users, user._id, handleConnectionStatus]);

  const userDisconnected = React.useCallback(({ userId }) => {
    handleConnectionStatus(userId, false)
  }, [handleConnectionStatus]);

  React.useEffect(() => {
    socket.on('user connected', ({ userId, username }) => {
      onUserConnected(userId, username)
    })

    socket.on("user disconnected", (user) => {
      userDisconnected(user)
    })
  }, [socket, onUserConnected, userDisconnected])
    return (
      <div className="chat-sidebar">
        <h2>Open Chat</h2>
        <div>
          <h4 className="chat-header">Online users</h4>
          <div className="online-users">
            {users.map((user, i) => (
              <button onClick={() => setSelectedUser(user)} key={i} className="link user-link">
                <p>{user.username}</p>
                {user.hasNewMessage && (<span>1</span>)}
                {user.connected && (<div className="online-icon" />)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default MyFriends;
