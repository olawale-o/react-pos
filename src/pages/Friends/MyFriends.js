import React from "react";
import { Link } from "react-router-dom";

const MyFriends = ({ socket, users, setUsers, user }) => {
  console.log(users);
  const findUser = React.useCallback((userId) => {
    const userIndex = users.findIndex((user) => user.userId === userId);
    return userIndex >= 0;
  }, [users]);

  const handleConnectionStatus = React.useCallback((userId, status) => {
    const userIndex = users.findIndex((u) => u.userId === userId);
    if (userIndex >= 0) {
      users[userIndex].connected = status;
      setUsers([...users])
    }
  },  [users, setUsers]);

  const onUserConnected = React.useCallback((userId, username ) => {
    if (user.userId !== userId) {
        const userExists =  findUser(userId);
        if (userExists) {
          handleConnectionStatus(userId, true);
        } else {
          const newUser = { userId, username, connected: true };
          setUsers([...users, newUser])
        }
    }
  }, [findUser,setUsers, users, user.userId, handleConnectionStatus]);

  const userDisconnected = React.useCallback(({ userId }) => {
    handleConnectionStatus(userId, false)
  }, [handleConnectionStatus])
    React.useEffect(() => {
      socket.on('user connected', ({ userId, username }) => {
        console.log('user connected')
       onUserConnected(userId, username)
      })

      socket.on("user disconnected", (user) => {
        console.log('user disconnected', user)
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
                {user.connected && (<div className="online-icon" />)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default MyFriends;
