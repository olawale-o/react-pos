import React from 'react';
import { getUnfollowedUsers, addFriendRequestService } from '../../services/friendService';

const FriendSuggest = () => {
  const userData = JSON.parse(localStorage.getItem('user'))?.user;
  const [users, setUsers] = React.useState([]);
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
  }, [userData.username]);
  const addFriend = async (id) => {
    const data = await addFriendRequestService({ requester: userData._id, recipient: id });
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
                <button type="button" onClick={() => addFriend(user._id)} ><span>Add</span></button>
              </div>
            </li>
          )
        })}
      </ul>)}
    </div>
  )
};

export default FriendSuggest;
