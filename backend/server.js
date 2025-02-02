require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('./database');
const userRoutes = require('./routes/userRoutes');
const gameRoomRoutes = require('./routes/gameRoomRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Engedelyezzuk a kliens oldal forrasat
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true, // Ha hitelesítést is használsz
  },
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectToDatabase();

app.use('/api/users', userRoutes);
app.use('/api/gameRooms', gameRoomRoutes);

//Websocket esemenyek
io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);

  //Csatlakozas a szobahoz
  socket.on('joinRoom', (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room ${roomID}`);
    io.to(roomID).emit('userJoined', { userID: socket.id, roomID });
  });

  //uzenet kuldese
  socket.on('sendMessage', ({ roomID, message }) => {
    console.log(`Message sent in room ${roomID}:`, message);
    io.to(roomID).emit('receiveMessage', { userID: socket.id, message });
  });

  //kartyalap lerakasa
  socket.on('playCard', ({ roomID, card }) => {
    console.log(`Card played in room ${roomId}:`, card);
    io.to(roomID).emit('cardPlayed', { userId: socket.id, card });
  });

  //uzenet kuldese egy szobaban
  socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('receiveMessage', { userId: socket.id, message });
  });

  //jatekos kilepese a szobabol
  socket.on('disconnect', () => {
    console.log('A user disconnected: ', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});