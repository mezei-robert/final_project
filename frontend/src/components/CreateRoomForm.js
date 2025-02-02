import React, { useState } from 'react';
import axios from 'axios';

const CreateRoomForm = () => {
    const [roomName, setRoomName] = useState('');

    const handleCreateRoom = async (event) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3000/api/gamerooms/create',
                { name: roomName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            console.log('Room created:', response.data);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    return (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Room</h2>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={handleCreateRoom}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Create Room
          </button>
        </div>
      );
};

export default CreateRoomForm;