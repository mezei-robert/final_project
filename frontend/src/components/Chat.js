import React, { useEffect, useState } from 'react';
import socket from '../services/socket';

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
      //csatlakozas a szobahoz
      // socket.emit('joinRoom', roomId);

      //uzenetek fogadasa
      socket.on('receiveMessage', (data) => {
          setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
          socket.off('receiveMessage');
      };
  }, [roomId]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit('sendMessage', { roomId, message: inputMessage });
      setInputMessage('');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Chat</h3>
      <div className="bg-gray-50 p-4 rounded-lg h-48 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong className="text-blue-600">{msg.userId}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;