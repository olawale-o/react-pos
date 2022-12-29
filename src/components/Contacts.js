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

const Contacts = ({ setSelectedUser, onlineUsers }) => {
  return (
    <ul className="contacts">
      {Object.entries(onlineUsers).map(([k, v]) =>{
        return (
          <Contact
            key={k}
            user={v}
            setSelectedUser={setSelectedUser}
          />
        )
      })}
    </ul>
  )
};

export default Contacts;
