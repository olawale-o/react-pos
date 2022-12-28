import React from "react";
import { useOutletContext } from "react-router";
import ChatSideBar from "../../components/ChatSideBar";
import ChatArea from "../../components/ChatArea";

const Chat = () => {
  // console.log(JSON.parse(localStorage.getItem('user')));
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
    messages.forEach(({ text, from, to, username }) => chatMessages.push({ to, from, text, username }))
    setMessages([...chatMessages])
  }, []);

  React.useEffect(() => {
    socket.on('connect', () => console.log('connected'));
    checkIfUserExist();

    socket.on('session', async({ sessionId, userId, username }) => {
      if (sessionId && userId && username) {
        socket.auth = { sessionId: sessionId };
        localStorage.setItem('sessionId', sessionId);
        setUser({ sessionId, _id: userId, username})
      }
    });

    socket.on("users", (data) => {
      console.log("users", data);
      setUsers(data)
    });
    socket.on('private message', (message) => handlePrivateChat(message));
    socket.on('user messages', (messages) => userMessages(messages));

    return () => {
      socket.off('session');
      socket.off('users');
      socket.off('private message');
      socket.off('user messages');
    }
  }, [socket, checkIfUserExist, userMessages, handlePrivateChat]);

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
      <ChatSideBar
        socket={socket}
        users={users}
        setUsers={setUsers}
        user={user}
        setSelectedUser={onUserSelected}
        selectedCurrentUser={selectedCurrentUser}
      />
      <div className="chat-area">
        {
          selectedUser._id ?
          (<ChatArea
            socket={socket}
            selectedUser={selectedUser}
            messages={messages}
            setMessages={setMessages}
          />)
           :
          (<div>Please select a user to chat with</div>)
        }
      </div>
    </div>
  );
};

export default Chat;
