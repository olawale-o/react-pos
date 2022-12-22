import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { getUnfollowedUsers } from '../../services/friendService';
import MyFriends from './MyFriends';

const Friends = () => {
  const [socket] = useOutletContext();
  const [users, setUsers] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  const userData = JSON.parse(localStorage.getItem('user')).user;
  const [user, setUser] = React.useState({});
  const [messages, setMessages] = React.useState([]);

  const checkIfUserExist = React.useCallback(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      socket.auth = {sessionId: sessionId};
      socket.connect();
    }
  }, [socket])

  // React.useEffect(() => {
  //   async function getUsers() {
  //     try {
  //       const followers = await getUnfollowedUsers(userData.username);
  //       setUsers(followers)
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getUsers();
  // }, [userData.username]);

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })
    checkIfUserExist();
    return () => {
      socket.off('connect')
    }
  }, [socket, checkIfUserExist]);


  React.useEffect(() => {
    socket.on('session', async({ sessionId, userId, username }) => {
      if (sessionId && userId && username) {
        console.log('session', { sessionId, userId, username });
        socket.auth = { sessionId: sessionId };
        localStorage.setItem('sessionId', sessionId);
        setUser({ sessionId, userId, username})
      }
    })
    return () => {
      socket.off('session')
    }
  }, [socket])

  React.useEffect(() => {
    socket.on("users", async (data) => {
      setUsers(data)
    });
    return () => {
      socket.off('users')
    }
  }, [socket])
  return (
    <div className="chat">
      <MyFriends
        socket={socket}
        users={users}
        setUsers={setUsers}
        user={user}
        followers={followers}
      />
      <div className="chat-main">
        {JSON.stringify(user)}
        {/* <Outlet /> */}
      </div>
    </div>
)};

export default Friends;
