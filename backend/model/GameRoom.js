const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxPlayers: { type: Number, default: 4 },
    isGameStarted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const GameRoom = mongoose.model("GameRoom", gameRoomSchema);

module.exports = GameRoom;