import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import OnlineUsers from "../components/OnlineUsers";
import ChatWindow from "../components/ChatWindow";
import Register from "../components/Register";
import "./App.css";

const socket = io("http://localhost:3005");

const App = () => {
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      socket.emit("register", user);

      socket.on("registered", ({ users }) => {
        setOnlineUsers(Object.entries(users));
      });

      socket.on("receive_message", ({ from, text }) => {
        setMessages((prev) => [...prev, { from, text }]);
      });

      return () => socket.disconnect();
    }
  }, [user]);

  const handleRegister = (phoneNumber, name) => {
    setUser({ phoneNumber, name });
  };

  const sendMessage = (text) => {
    if (currentUser) {
      const message = { from: user.phoneNumber, to: currentUser[0], text };
      socket.emit("send_message", message);
      setMessages((prev) => [...prev, message]);
    }
  };

  return (
    <div className="app">
      {!user ? (
        <Register onRegister={handleRegister} />
      ) : (
        <>
          <OnlineUsers
            users={onlineUsers}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
          <ChatWindow
            currentUser={currentUser}
            messages={messages.filter(
              (msg) =>
                msg.to === currentUser?.[0] || msg.from === currentUser?.[0]
            )}
            sendMessage={sendMessage}
          />
        </>
      )}
    </div>
  );
};

export default App;
