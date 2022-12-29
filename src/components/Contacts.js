import React from "react";

const Contact = ({
  user,
  setSelectedUser,
}) => {
  return (
    <li className="contact-item">
      <button className="contact-button" onClick={() => setSelectedUser(user)}>
        <div className="contact">
          <div className="avatar-container" />
          <div className="last-message">
            <span>{user.username}</span>
            <span className="text">text</span>
          </div>
          <div className="chat-state">
            <span>16:45</span>
            <div className={`online-state ${user.online ? 'online' : 'idle'}` }/>
          </div>
        </div>
      </button>
    </li>
  )
}

const Contacts = ({ socket, user, users, setUsers, setSelectedUser }) => {
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
    if (user._id !== userId) {
        const userExists = findUser(userId);
        if (userExists) {
          handleConnectionStatus(userId, true);
        } else {
          const newUser = { _id: userId, userId: userId, username, online: true };
          setUsers([...users, newUser])
        }
    }
  }, [findUser,setUsers, users, user._id, handleConnectionStatus]);

  const userDisconnected = React.useCallback(({ userId }) => {
    handleConnectionStatus(userId, false)
  }, [handleConnectionStatus]);

  React.useEffect(() => {
    socket.on('user connected', ({ userId, username }) => {
      console.log('user connected');
      onUserConnected(userId, username)
    })

    socket.on("user disconnected", (user) => {
      userDisconnected(user)
    })
  }, [socket, onUserConnected, userDisconnected])
  return (
    <ul className="contacts">
      {users.map((user,i) =>{
        return (
          <Contact
            key={i}
            user={user}
            setSelectedUser={setSelectedUser}
          />
        )
      })}
    </ul>
  )
};

export default Contacts;
