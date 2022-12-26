import { BiPaperclip, BiSend } from 'react-icons/bi'

const ChatInput = () => {
  return (
    <div className="chat-input-container">
      <div className="chat-input-content">
        <input type="text" className="chat-input" placeholder="write your message" />
        <div className="utils">
          <button className="clip">
            <BiPaperclip />
          </button>
          <button className="send">
            <BiSend />
          </button>
        </div>
      </div>
    </div>
  )
};

const ChatMessage = () => {
  return (
    <div className="chat-message-container">
      <div className="avatar-container" />
      <div className="message-area">
        <div className="chat-message-content">
          <span className="chat-profile-name">Profile name</span>
          <p className="chat-message text-sm">
            is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since
          </p>
        </div>
        <div className="chat-message-timestamp">
          <span className="timestamp text-sm">16:45</span>
          <div className="online-state online small-circle" />
        </div>
      </div>
    </div>
  )
};

const ChatBody = () => {
 return (
    <div className="chat-body">
      <ChatMessage />
    </div>
 )
};


const ChatArea = () => {
  return (
    <div className="chat-area">
      <ChatBody />
      <ChatInput />
    </div>
  )
};

export default ChatArea;