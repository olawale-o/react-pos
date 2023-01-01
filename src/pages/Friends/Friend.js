import React from "react";
import { useLoaderData, useOutletContext } from "react-router";
import { getContactService } from "../../services/friendService";

export async function loader({ params }) {
  const contact = await getContactService(params.id);
  return { contact };
}

const ChatBody = ({ contact, messages, lastMessageRef, typingStatus }) => {
  return (
    <>
      <header className="chat-main-header">
        <p>Hangout with {contact.username}</p>
      </header>
  
      <div className="message-container">
        {messages?.map((message, i) => 
          message.username === JSON.parse(localStorage.getItem('user')).user.username
          ? (
            <div className="message-chats" key={i}>
              <p className="sender-name">You</p>
              <div className="message-sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message-chats" key={i}>
              <p>{message.username}</p>
              <div className="message-recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}
        <div className="message-status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  )
};

const ChatFooter = ({ socket, contact, messages, setMessages, user }) => {
    let timeout  = setTimeout(function(){}, 0);
    const [message, setMessage] = React.useState('');
    const handleTyping = () => {
      clearTimeout(timeout);
      socket.emit('typing', `${JSON.parse(localStorage.getItem('user')).user.username} is typing`);
      timeout = setTimeout(() => {
        socket.emit('doneTyping', '')
      }, 5000)
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newMessage = {
        userId: user._id,
        username: user.username,
        text: message,
      }
      socket.emit('private message', {
        text: message,
        to: contact._id
      });
      setMessages([...messages, newMessage])
      setMessage('');
    }
    return (
      <div className="chat-footer">
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={`Write ${contact.username} a message`}
            className="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
          />
          <button className="send-btn">Send</button>
        </form>
      </div>
    )
};
  
const Friend = () => {
  const [socket, users, setUsers] = useOutletContext();
  const userData = JSON.parse(localStorage.getItem('user')).user;
  const { contact } = useLoaderData();
  const [messages, setMessages] = React.useState([]);
  const lastMessageRef = React.useRef(null);
  const [typingStatus, setTypingStatus] = React.useState('');
  const handleNewMessage = React.useCallback((userId, status) => {
    const userIndex = users.findIndex((user) => user._id === userId);
    if (userIndex >= 0) {
      users[userIndex].hasNewMessage = status;
      setUsers([...users]);
    }
  }, [users, setUsers]);
  const handleNewMessageStatus = React.useCallback((userId, status) => {
    const userIndex = users.findIndex((user) => user._id === userId);
    if (userIndex >= 0) {
      users[userIndex].hasNewMessage = status;
      setUsers([...users]);
    }
  }, [users, setUsers]);
  React.useEffect(() => {
    setMessages([]);
    handleNewMessage(contact._id, false);
  }, [contact._id, handleNewMessage]);

  React.useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    socket.on('typingResponse' , (data) => setTypingStatus(data));
    socket.on('doneTypingResponse' , (data) => setTypingStatus(data));
  }, [socket]);
  React.useEffect(() => {
    socket.on('private message', (message) => {
      if (contact._id === message.from) {
        const newMessage = {
          userId: message.from,
          text: message.text,
          username: message.username
        }
        setMessages([...messages, newMessage]);
      } else {
        handleNewMessageStatus(message.from, true)
      }
    });
  }, [socket, messages, contact._id, userData, handleNewMessageStatus]);
  
  return (
    <>
      <ChatBody
        messages={messages}
        lastMessageRef={lastMessageRef}
        typingStatus={typingStatus}
        contact={contact}
      />
      <ChatFooter
        socket={socket}
        contact={contact}
        messages={messages}
        setMessages={setMessages}
        user={userData}
      />
    </>
  );
};

export default Friend;
