import React from "react";
import { Link } from "react-router-dom";

const MyFollowers = ({ socket, users, setUsers, user }) => {
  const findUser = React.useCallback((userId) => {
    const userIndex = users.findIndex((user) => user._id === userId);
    return userIndex >= 0;
  }, [users]);

  const handleConnectionStatus = React.useCallback((userId, status) => {
    const userIndex = users.findIndex((u) => u._id === userId);
    if (userIndex >= 0) {
      users[userIndex].online = status;
      setUsers([...users])
    }
  },  [users, setUsers]);

  const onUserConnected = React.useCallback((userId, username) => {
    if (user.userId !== userId) {
        const userExists = findUser(userId);
        if (userExists) {
          console.log('user exist');
          handleConnectionStatus(userId, true);
        } else {
          console.log('user no exist');
          const newUser = { _id: userId, username, online: true };
          setUsers([...users, newUser])
        }
    }
  }, [findUser,setUsers, users, user.userId, handleConnectionStatus]);

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
              <Link to={`${user.userId}`} key={i} className="link user-link">
                <p>{user.username}</p>
                {user.online && (<div className="online-icon" />)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default MyFollowers;
