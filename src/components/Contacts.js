const Contact = () => {
  return (
    <li className="contact-item">
      <button className="contact-button">
        <div className="contact">
          <div className="avatar-container" />
          <div className="last-message">
            <span>Profile name</span>
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

const Contacts = () => {
  return (
    <ul className="contacts">
      {Array.from([1,2,3,4,5,6]).map((i) =>{
        return (
          <Contact />
        )
      })}
    </ul>
  )
};

export default Contacts;
