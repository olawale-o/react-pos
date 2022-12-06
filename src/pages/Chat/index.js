import React from "react";

const ChatBar = ({ socket }) => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    socket.on('appearance', (data) => setUsers(data))
  }, [socket, users]);
  return (
    <div className="chat-sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat-header">Online users</h4>
        <div className="online-users">
          {users.map((user) => (
            <p key={user.socketID}>{user.userName}</p>
          ))}
        </div>
      </div>
    </div>
  )
};

const ChatBody = ({ messages, lastMessageRef, typingStatus }) => {
  console.log(messages)
  return (
    <>
      <header className="chat-main-header">
        <p>Hangout with colleagues</p>
      </header>

      <div className="message-container">
        {messages.map((message) => 
          message.name === localStorage.getItem('userName') 
          ? (
            <div className="message-chats" key={message.id}>
              <p className="sender-name">You</p>
              <div className="message-sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message-chats" key={message.id}>
              <p>{message.name}</p>
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
const ChatFooter = ({ socket }) => {
  let timeout  = setTimeout(function(){}, 0);
  const [message, setMessage] = React.useState('');
  const handleTyping = () => {
    clearTimeout(timeout);
    socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
    timeout = setTimeout(() => {
      socket.emit('doneTyping', '')
    }, 5000)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
    })
    socket.emit('message',  {
      text: message,
      name: localStorage.getItem('userName'),
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    });
    setMessage('');
  }
  return (
    <div className="chat-footer">
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onBlur={() => console.log('blur')}
        />
        <button className="send-btn">Send</button>
      </form>
    </div>
  )
};

const Chat = ({ socket }) => {
  const [messages, setMessages] = React.useState([]);
  const lastMessageRef = React.useRef(null);
  const [typingStatus, setTypingStatus] = React.useState('');
  React.useEffect(() => {
    socket.on('serverReply', (data) => setMessages([...messages, data]))
  }, [socket, messages]);

  React.useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    socket.on('typingResponse' , (data) => setTypingStatus(data));
    socket.on('doneTypingResponse' , (data) => setTypingStatus(data));
  }, [socket]);
  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat-main">
        <ChatBody
          messages={messages}
          lastMessageRef={lastMessageRef}
          typingStatus={typingStatus}
        />
        <ChatFooter socket={socket} />
      </div>
    </div>
  )
};

export default Chat;
