import React from 'react';
import MessageInput from './MessageInput';

const ChatWindow = ({ currentUser, messages, sendMessage }) => {
  return (
    <div className="chat-window">
      {currentUser ? (
        <>
          <header>
            <h3>Chat with {currentUser[1].name}</h3>
          </header>
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.from === currentUser[0] ? 'incoming' : 'outgoing'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <MessageInput sendMessage={sendMessage} />
        </>
      ) : (
        <div className="no-user">Select a user to start chatting</div>
      )}
    </div>
  );
};

export default ChatWindow;
