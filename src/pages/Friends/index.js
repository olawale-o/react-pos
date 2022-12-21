import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { getUnfollowedUsers } from '../../services/friendService';

const MyFriends = ({ socket }) => {
  const [users, setUsers] = React.useState([]);
  // const [onlineUsers, setOnlineUsers] = React.useState([]);
  const userData = JSON.parse(localStorage.getItem('user')).user;
  const [user, setUser] = React.useState({});


  const checkIfUserExist = React.useCallback(() => {
    console.log('callback')
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId && userData) {
      socket.auth = {sessionId: sessionId};
      socket.connect();
    }
  }, [socket, userData])

  React.useEffect(() => {
    checkIfUserExist();
    socket.on('session', ({ sessionId, userId, username }) => {
      console.log('session', { sessionId, userId, username });
      socket.auth = { sessionId: sessionId };
      localStorage.setItem('sessionId', sessionId);
      setUser({ sessionId, userId, username})
    })
  }, [socket, checkIfUserExist]);

  React.useEffect(() => {
    async function getUsers() {
      try {
        const data = await getUnfollowedUsers(userData.username);
        setUsers(data)
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, [userData.username, socket]);

  return (
    <div className="chat-sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat-header">Online users</h4>
        <div className="online-users">
          {users.map((user) => (
            <Link to={`${user._id}`} key={user._id} className="link user-link">
              <p>{user.username}</p>
              {/* {user._id && (<div className="online-icon" />)} */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
const Friends = ({ socket }) => (
  <div className="chat">
    <MyFriends socket={socket} />
    <div className="chat-main">
      <Outlet />
    </div>
  </div>
);

export default Friends;
