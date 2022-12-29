import React from "react";
import { BiCog, BiChevronRightSquare, BiSearch } from "react-icons/bi";
import Contacts from "./Contacts";

const ChatSideBarHeader = ({ user }) => {
  return (
    <div className="chatsidebard-header">
      <div className="header-nav">
        <span className="icon">
          <BiCog />
        </span>
        <span className="icon">
          <BiChevronRightSquare />
        </span>
      </div>
      <div className="img-container" />
      <span className="profile-name">{user.username}</span>
      <div className="search">
        <input className="search-input" type="text" placeholder="Search" />
        <span className="icon">
          <BiSearch />
        </span>
      </div>
    </div>
  );
};

const ChatSideBar = ({ socket, users, setUsers, user, setSelectedUser }) => {
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
    <div className="chatsidebar">
      <ChatSideBarHeader user={user} />
      <Contacts
        users={users}
        setSelectedUser={setSelectedUser}
        user={user}
        setUsers={setUsers}
        socket={socket}
      />
    </div>
  )
};

export default ChatSideBar;
