const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const GameRoom = require("../model/GameRoom");
const GameState = require("../model/GameState");
const { findStartingPlayer, canPlayCard } = require('../utils/gameLogic');
const User = require("../model/User");
const { createDeck, shuffleDeck } = require("../utils/cards");
const router = express.Router();

//Jatekterem letrehozasa
router.post("/create", authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const userID = req.user.id;

        const existingRoom = await GameRoom.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ error: "Room already exists!" });
        }

        const newRoom = new GameRoom({ name, players: [userID] });
        await newRoom.save();

        res.status(201).json({ message: "Room created successfully!", room: newRoom });
    } catch (error) {
        console.error("Error creating room: ", error);
        res.status(500).json({ message: error.message });
    }
});

//csatlakozas a jatekteremhez
router.post("/join/:roomID", authenticateToken, async (req, res) => {
    try {
        const roomID = req.params;
        const userID = req.user.id;

        const room = await GameRoom.findById(roomID);
        if (!room) {
            return res.status(404).json({ error: "Room not found!" });
        }

        if (room.players.length >= room.maxPlayers) {
            return res.status(400).json({ error: "Room is full!" });
        }

        if (room.players.includes(userID)) {
            return res.status(400).json({ error: "You are already in this room!" });
        }

        room.players.push(userID);
        await room.save();

        res.status(200).json({ message: "Joined room successfully!", room });
    } catch (error) {
        console.error("Error joining room: ", error);
        res.status(500).json({ message: error.message });
    }
});

//jatekterem inditasa
router.post("/start/:roomID", authenticateToken, async (req, res) => {
    try {
        const { roomID } = req.params;
        const userID = req.user.id;

        const room = await GameRoom.findById(roomID);
        if (!room) {
            return res.status(404).json({ error: "Room not found!" });
        }

        if (!room.players.includes(userID)) {
            return res.status(403).json({ error: "You are not in this room!" });
        }

        if (room.players.length < 2) {
            return res.status(400).json({ error: "Not enough players to start the game!" });
        }

        const deck = shuffleDeck(createDeck());

        //kartyak kiosztasa
        const players = room.players.map((playerId) => {
            const hiddenCards = deck.splice(0, 3); //3 leforditott lap
            const hand = deck.splice(0, 6); //6 lap a kezben
            return {
                userId: playerId,
                hiddenCards,
                hand,
                selectedCards: [], //a 3 kivalasztott lap
                points: 0,
            };
        });

        //kartya osztas es jatek allapotanak beallitasa
        const gameState = new GameState({
            roomId: roomID._id,
            players,
            deck,
            currentBid: 0,
            currentPlayer: room.players[0], //elso jatekos
        });
        await gameState.save();

        room.isGameStarted = true;
        await room.save();

        res.status(200).json({ message: "Game started successfully!", room, gameState });
    } catch (error) {
        console.error("Error starting game: ", error);
        res.status(500).json({ message: error.message });
    }
});

//kartya kijatszasa
router.post('/play-card/:roomID', authenticateToken, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { card } = req.body;
        const userID = req.user.id;

        const gameState = await GameState.findOne({ roomId });
        if (!gameState) {
            return res.status(404).json({ error: "Game state not found!" });
        }

        const player = gameState.players.find((p) => p.userId === userID);
        if (!player) {
            return res.status(403).json({ error: "You are not in this game!" });
        }

        //ellenorizzuk, hogy a jatekos rakhat-e lapot
        if (!canPlayCard(card, gameState.currentCard)) {
            return res.status(400).json({ error: "You cannot play this card!" });
        }

        //lap eltavolitasa a jatekos kezebol
        player.hand = player.hand.filter((c) => c !== card);

        //lapot hozzaadjuk a lerakott lapokhoz
        gameState.playedCards.push(card);

        //kepesseg kartyak kezelese
        if (card.rank === '10') {
            gameState.playedCards = [];
        } else if (card.rank === 'Joker') {
            const nextPlayer = gameState.players.find((p) => p.userId !== userID);
            nextPlayer.hand = [...nextPlayer.hand, ...gameState.playedCards];
            gameState.playedCards = [];
        }

        const currentPlayerIndex = gameState.players.findIndex((p) => p.userId === userID);
        const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
        gameState.currentPlayer = gameState.players[nextPlayerIndex].userId;
        
        await gameState.save();

        //websocket a jatek allapotanak frissitesehez
        io.to(roomId).emit('gameStateUpdated', gameState);

        res.status(200).json({ message: "Card played successfully!", gameState });
    } catch (error) {
        console.error("Error playing card: ", error);
        res.status(500).json({ message: error.message });
    }
});

//jatek ujrainditasa
router.post('/restart-game/:roomID', authenticateToken, async (req, res) => {
    try {
        const { roomId } = req.params;

        const gameState = await GameState.findOne({ roomId });
        if (!gameState) {
            return res.status(404).json({ error: "Game state not found!" });
        }

        const deck = shuffleDeck(createDeck());

        const players = room.players.map((playerId) => {
            const hiddenCards = deck.splice(0, 3); //3 leforditott lap
            const hand = deck.splice(0, 6); //6 lap a kezben
            return {
                userId: playerId,
                hiddenCards,
                hand,
                selectedCards: [], //a 3 kivalasztott lap
                points: 0,
            };
        });

        gameState.players = players;
        gameState.deck = deck;
        gameState.currentBid = 0;
        gameState.currentPlayer = findStartingPlayer(players);
        gameState.isGameFinished = false;
        gameState.playedCards = [];

        await gameState.save();

        io.to(roomId).emit('gameStateUpdated', gameState);
        res.status(200).json({ message: "Game restarted successfully!", gameState });
    } catch (error) {
        console.error("Error restarting game: ", error);
        res.status(500).json({ message: error.message });
    }
});

//jatektermek listazasa
router.get("/", async (req, res) => {
    try {
        const rooms = await GameRoom.find().populate("players", "username");
        res.status(200).json({ rooms });
    } catch (error) {
        console.error("Error getting rooms: ", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;