import React from "react";
import { getPendingFriendRequest, acceptFriendRequestService } from "../../services/friendService";

const Pending = () => {
  const userData = JSON.parse(localStorage.getItem('user'))?.user;
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    async function getUsers() {
      try {
        const data = await getPendingFriendRequest(userData._id);
        setUsers(data)
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, [userData._id]);

  const handleRequest = async (status, requestId) => {
    let response = null;
    if (status === 'Accept') {
      response = await acceptFriendRequestService({ request_id: requestId });
    }
    console.log(response);
  };
  return (
    <div className="users">
      {users?.length > 0 && (<ul className="user-list">
        {users?.map((user) => {
          return (
            <li className="user-item" key={user._id}>
              <div className="user-container">
                <span className="user-name">
                  {user.request.to === userData._id ? user.requester.username : user.recipient.username}
                </span>
                <button type="button" onClick={() => handleRequest(user.request.to === userData._id ? 'Accept' : 'Cancel', user._id)}>
                  <span>{user.request.to === userData._id ? 'Accept' : 'Cancel'}</span>
                </button>
              </div>
            </li>
          )
        })}
      </ul>)}
    </div>
  );
}

export default Pending;
