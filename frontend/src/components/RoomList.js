import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/gamerooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/gamerooms/join/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Joined room successfully!');
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id} className="mb-2">
            {room.name} (Players: {room.players.length})
            <button
              onClick={() => handleJoinRoom(room._id)}
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;