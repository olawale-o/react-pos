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

const ChatSideBar = ({ socket, user, setSelectedUser, onlineUsers, setOnlineUsers }) => {
  const findUser = React.useCallback((userId) => {
    const user = onlineUsers[userId];
    return user
  }, [onlineUsers]);

  const handleConnectionStatus = React.useCallback((userId, status) => {
  
    const userExists = findUser(userId);
    if (userExists) {
      user.online = status;
      setOnlineUsers({ ...onlineUsers });
    }

  },  [setOnlineUsers, findUser, user, onlineUsers]);

  const onUserConnected = React.useCallback((userId, username) => {
    console.log('on user connected');
    if (user._id !== userId) {
        const userExists = findUser(userId);
        if (userExists) {
          console.log('userExists', userExists);
          handleConnectionStatus(userId, true);
        } else {
          console.log('user does not exist');
          console.log(onlineUsers);
          const newUser = onlineUsers[userId];
          if (newUser) {
            newUser.online = true;
            setOnlineUsers({ ...onlineUsers });
          }
        }
    }
  }, [handleConnectionStatus, findUser, onlineUsers, setOnlineUsers, user._id]);

  const userDisconnected = React.useCallback(({ userId }) => {
    handleConnectionStatus(userId, false)
  }, [handleConnectionStatus]);

  React.useEffect(() => {
    socket.on('user connected', ({ userId, username }) => {
      console.log('user connected', userId, username)
      onUserConnected(userId, username)
    })

    socket.on("user disconnected", (user) => {
      console.log(user, 'disconnected')
      userDisconnected(user)
    })
  }, [socket, onUserConnected, userDisconnected])
  return (
    <div className="chatsidebar">
      <ChatSideBarHeader user={user} />
      <Contacts
        setSelectedUser={setSelectedUser}
        user={user}
        socket={socket}
        onlineUsers={onlineUsers}
        setOnlineUsers={setOnlineUsers}
      />
    </div>
  )
};

export default ChatSideBar;
