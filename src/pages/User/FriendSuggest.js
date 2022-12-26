import React from 'react';
import { getFriendSuggestionService, addFriendRequestService } from '../../services/friendService';

const FriendSuggest = ({ socket }) => {
  const [friendRequest, setFriendRequest] = React.useState({});
  const userData = JSON.parse(localStorage.getItem('user'))?.user;
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    async function getUsers() {
      try {
        const data = await getFriendSuggestionService(userData._id);
        setUsers(data)
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, [userData._id]);

  React.useEffect(() => {
    socket.on('newFriendRequest', (data) => setFriendRequest({ requester: data.requester, recipient: data.recipient }));
  }, [socket]);
  const addFriend = async (id) => {
    const data = await addFriendRequestService({ requester: userData._id, recipient: id, socketId: socket.id });
    console.log(data)
  };
  return (
    <div className="users">
      {users?.length > 0 && (<ul className="user-list">
        {users?.map((user) => {
          return (
            <li className="user-item" key={user._id}>
              <div className="user-container">
                <span className="user-name">{user.username}</span>
                {
                  friendRequest?.requester &&
                  friendRequest.requester === userData._id &&
                  friendRequest.recipient === user._id &&
                  (<button type="button" onClick={() => addFriend(user._id)}><span>Cancel</span></button>)
                }
                {
                  friendRequest?.requester &&
                  friendRequest.requester !== userData._id &&
                  friendRequest.requester === user._id &&
                  (<button type="button" onClick={() => addFriend(user._id)}><span>Accept</span></button>)
                }
                {
                  userData._id &&
                  (friendRequest.recipient === undefined || friendRequest?.recipient !== user._id)
                  &&
                  (friendRequest.requester === undefined || friendRequest?.requester !== user._id)
                  &&
                  (<button type="button" onClick={() => addFriend(user._id)}><span>Add</span></button>)
                }
              </div>
            </li>
          )
        })}
      </ul>)}
    </div>
  )
};

export default FriendSuggest;
