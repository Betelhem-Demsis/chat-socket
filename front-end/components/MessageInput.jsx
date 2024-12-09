import React, { useState } from 'react';

const MessageInput = ({ sendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
