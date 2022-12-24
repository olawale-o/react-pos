import React from "react";
import { getContactService } from "../../services/friendService";

export async function loader({ params }) {
  const contact = await getContactService(params.id);
  return { contact };
}

const ChatBody = ({ contact, messages, lastMessageRef, typingStatus }) => {
  console.log(messages);
  return (
    <>
      <header className="chat-main-header">
        <p>Hangout with {contact.username}</p>
      </header>
  
      <div className="message-container">
        {messages?.map((message, i) => 
          message.from === JSON.parse(localStorage.getItem('user')).user._id
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
        _id: user._id,
        to: contact._id,
        from: user._id,
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
  
const ChatFriend = ({ socket, messages, setMessages, selectedUser }) => {
  const userData = JSON.parse(localStorage.getItem('user')).user;
  const lastMessageRef = React.useRef(null);
  const [typingStatus, setTypingStatus] = React.useState('');

  React.useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    socket.on('typingResponse' , (data) => setTypingStatus(data));
    socket.on('doneTypingResponse' , (data) => setTypingStatus(data));
  }, [socket]);
  
  return (
    <>
      <ChatBody
        messages={messages}
        lastMessageRef={lastMessageRef}
        typingStatus={typingStatus}
        contact={selectedUser}
      />
      <ChatFooter
        socket={socket}
        contact={selectedUser}
        messages={messages}
        setMessages={setMessages}
        user={userData}
      />
    </>
  );
};

export default ChatFriend;
