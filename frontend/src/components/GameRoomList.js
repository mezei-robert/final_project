import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GameRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');

  // Szobák lekérése
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/gamerooms');
        console.log('API Response:', response.data);
        setRooms(response.data.rooms);
      } catch (error) {
        console.error('Error fetching rooms: ', error);
      }
    };

    fetchRooms();
  }, []);

  // Szoba létrehozása
  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/gamerooms/create',
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Room created:', response.data);
      setRoomName(''); // Űrlap ürítése
      // Frissítsük a szobák listáját
      const updatedRooms = await axios.get('http://localhost:3000/api/gamerooms');
      setRooms(updatedRooms.data.rooms);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Game Rooms</h1>

      {/* Szoba létrehozása */}
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

      {/* Szobák listázása */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room._id} className="mb-2 p-4 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">{room.name}</span> (Players: {room.players.length}/{room.maxPlayers})
                </div>
                <button
                  // onClick={() => handleJoinRoom(room._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Join
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameRoomList;