import React from "react";
import { useLoaderData } from "react-router";
import { getContactService } from "../../services/friendService";

export async function loader({ params }) {
  const contact = await getContactService(params.id);
  return { contact };
}

const ChatBody = ({ contact, messages, lastMessageRef, typingStatus, id }) => {
  // const currentChat = messages[id];
  return (
    <>
      <header className="chat-main-header">
        <p>Hangout with {contact.username}</p>
      </header>
  
      <div className="message-container">
        {messages?.map((message, i) => 
          message.senderId === JSON.parse(localStorage.getItem('user')).user._id
          ? (
            <div className="message-chats" key={message.roomId}>
              <p className="sender-name">You</p>
              <div className="message-sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message-chats" key={message.roomId}>
              <p>{message.recipientId}</p>
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

const ChatFooter = ({ socket, contact }) => {
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
      socket.emit('private message',  {
        roomId: `${JSON.parse(localStorage.getItem('user')).user._id}-${contact._id}${socket.id}${Math.random()}`,
        text: message,
        senderId: `${JSON.parse(localStorage.getItem('user')).user._id}`,
        recipientId: contact._id,
        socketID: socket.id,
        recipientSocketId: contact.socketId,
        senderSocketId: socket.id
      });
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
  
const Friend = ({ socket }) => {
  const userData = JSON.parse(localStorage.getItem('user')).user._id;
  const { contact } = useLoaderData();
  const id = `${userData}-${contact._id}`;
  const [messages, setMessages] = React.useState([]);
  const lastMessageRef = React.useRef(null);
  const [typingStatus, setTypingStatus] = React.useState('');
  React.useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    socket.on('typingResponse' , (data) => setTypingStatus(data));
    socket.on('doneTypingResponse' , (data) => setTypingStatus(data));
  }, [socket]);
  React.useEffect(() => {
    socket.on('private message', (data) => {
      // let newState = {}
      // let oldState = { ...messages };
      // if (id in oldState || id.split("").reverse() in oldState) {
      //   const currentChats = [ ...oldState[`${id}`], data.data ];
      //   newState = { ...oldState, [`${id}`]: currentChats};
      // } else {
      //   newState = { [`${id}`]: [data.data] }
      // }
      // if ((data.data.senderId === contact._id && userData === data.data.recipientId)
      //   || (data.data.recipientId === contact._id && userData === data.data.senderId
      // )) {
      //   setMessages(newState);
      // }
      const newMessages = [...messages, data.data];
      localStorage.setItem('chats', JSON.stringify(newMessages));
      if ((data.data.senderId === contact._id && userData === data.data.recipientId)
        || (data.data.recipientId === contact._id && userData === data.data.senderId
      )) {
        console.log('hey');
      setMessages(newMessages);
    }
    });
  }, [socket, messages, id, contact._id, userData]);
  
  React.useEffect(() => {
    const conversations = JSON.parse(localStorage.getItem('chats')) || [];
    const ourConversations = conversations.filter((chat) => (chat.senderId === userData && chat.recipientId === contact._id)
      || (chat.senderId === contact._id && chat.recipientId === userData))
    setMessages(ourConversations);
  }, [userData, contact._id]);
  return (
    <>
      <ChatBody
        messages={messages}
        lastMessageRef={lastMessageRef}
        typingStatus={typingStatus}
        contact={contact}
        id={id}
      />
      <ChatFooter socket={socket} contact={contact}  />
    </>
  );
};

export default Friend;
