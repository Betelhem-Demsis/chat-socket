import React from "react";

const OnlineUsers = ({ users, currentUser, setCurrentUser }) => {
  return (
    <div className="online-users">
      <h3>Online Users</h3>
      <ul>
        {users.map(([phone, user]) => (
          <li
            key={phone}
            className={currentUser?.[0] === phone ? "active" : ""}
            onClick={() => setCurrentUser([phone, user])}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
