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
            <div className="online-state idle" />
          </div>
        </div>
      </button>
    </li>
  )
}

const Contacts = ({ users, setSelectedUser }) => {
  return (
    <ul className="contacts">
      {users.map((user,i) =>{
        return (
          <Contact
            key={i}
            user={user}
            setSelectedUser={setSelectedUser}
          />
        )
      })}
    </ul>
  )
};

export default Contacts;
