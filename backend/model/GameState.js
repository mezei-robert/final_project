const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GameRoom",
        required: true
    },
    players: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            hand: [
                {
                    type: String,
                    required: true
                }
            ],
            faceUpCards: [
                {
                    type: String,
                    required: true
                }
            ],
            faceDownCards: [
                {
                    type: String,
                    required: true
                }
            ],
            points: {
                type: Number,
                default: 0
            },
        },
    ],
    currentBid: {
        type: Number,
        default: 0
    },
    currentPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const GameState = mongoose.model("GameState", gameStateSchema);

module.exports = GameState;