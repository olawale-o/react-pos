import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ChatFriend from './ChatFriend';
import MyFriends from './MyFriends';

const Friends = () => {
  const [socket] = useOutletContext();
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [messages, setMessages] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState({});
  const selectedCurrentUser = React.useRef({});

  const handleNewMessageStatus = React.useCallback((userId, status) => {
    const userIndex = users.findIndex((user) => user._id === userId);
    if (userIndex >= 0) {
      users[userIndex].hasNewMessage = status;
      setUsers([...users]);
    }
  }, [users, setUsers]);

  const handlePrivateChat = React.useCallback((message) => {
    console.log(selectedCurrentUser.current);
    if (selectedCurrentUser.current._id) {
      if (selectedCurrentUser.current._id === message.from) {
        const newMessage = {
          userId: message.from,
          text: message.text,
          username: message.username,
          _id: message.from,
          from: message.from,
          to: message.to
        }
        setMessages([...messages, newMessage]);
        // handleNewMessageStatus(message.from, false)
      } else {
        console.log('not equal');
        handleNewMessageStatus(message.from, true)
      }
    } else {
      handleNewMessageStatus(message.from, true)
    }
  }, [handleNewMessageStatus, messages, selectedCurrentUser])

  const checkIfUserExist = React.useCallback(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      socket.auth = {sessionId: sessionId};
      socket.connect();
    }
  }, [socket])

  const userMessages = React.useCallback(({ messages }) => {
    console.log('chatMessages', messages);
    const chatMessages = [];
    messages.forEach(({ text, from, to, username }) => {
      chatMessages.push({ to, from, text, username })
    })
    setMessages([...chatMessages])
  }, []);


  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })
    checkIfUserExist();
    return () => {
      socket.off('connect')
    }
  }, [socket, checkIfUserExist]);


  React.useEffect(() => {
    socket.on('session', async({ sessionId, userId, username }) => {
      if (sessionId && userId && username) {
        console.log('session', { sessionId, userId, username });
        socket.auth = { sessionId: sessionId };
        localStorage.setItem('sessionId', sessionId);
        setUser({ sessionId, _id: userId, username})
      }
    })
    return () => {
      socket.off('session')
    }
  }, [socket])

  React.useEffect(() => {
    socket.on("users", async (data) => {
      setUsers(data)
    });
    return () => {
      socket.off('users')
    }
  }, [socket]);


  React.useEffect(() => {
    socket.on('private message', (message) => handlePrivateChat(message));
  }, [socket, handlePrivateChat]);

  React.useEffect(() => {
    socket.on('user messages', (messages) => userMessages(messages));
  }, [socket, userMessages]);

  const onUserSelected = async (user) => {
    console.log('user selected', user);
    setSelectedUser(user);
    setMessages([]);
    selectedCurrentUser.current = user;
    await socket.emit('user messages', user);
    handleNewMessageStatus(user._id, false)
  };
  
  return (
    <div className="chat">
      <MyFriends
        socket={socket}
        users={users}
        setUsers={setUsers}
        user={user}
        setSelectedUser={onUserSelected}
        selectedCurrentUser={selectedCurrentUser}
      />
      <div className="chat-main">
        {selectedUser._id ? (<ChatFriend
          socket={socket}
          selectedUser={selectedUser}
          messages={messages}
          setMessages={setMessages}
        />) : (<p>Select a user to chat with</p>)}
        {/* <Outlet context={[socket, users, setUsers]} /> */}
      </div>
    </div>
)};

export default Friends;
