import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectCards from './SelectCards';
import PlayCard from './PlayCard';
import socket from '../services/socket';
import PlayerOrder from './PlayerOrder';
import Chat from './Chat';

const GameRoom = ({ roomId }) => {
    const [hand, setHand] = useState([]);
    const [gameState, setGameState] = useState(null);

    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/gamestate/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
            });
            setGameState(response.data);
            setHand(response.data.players.find((p) => p.userId === localStorage.getItem('userId')).hand);
            } catch (error) {
                console.error('Error fetching game state:', error);
            }
        };

        fetchGameState();

        socket.emit('joinRoom', roomId);

        socket.on('gameStateUpdated', (updatedGameState) => {
            console.log('Game state updated:', updatedGameState);
            setGameState(updatedGameState);
            setHand(updatedGameState.players.find((p) => p.userId === localStorage.getItem('userId')).hand);
        });

        return () => {
            socket.off('gameStateUpdated');
        };
    }, [roomId]);

    //websocket esemenyek
    // socket.emit('joinRoom', roomId);

    socket.on('cardPlayed', (data) => {
        console.log('Card played:', data);
        //frissitjuk a jatek allapotat
        setGameState((prevState) => ({
            ...prevState,
            playedCards: [...prevState.playedCards, data.card],
        }));

        return () => {
            socket.off('cardPlayed');
        };
    }, [roomId]);

    const handleSelectCards = async (SelectCards) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/gamerooms/select-cards/${roomId}`, { SelectCards }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error selecting cards:', error);
        }
    };

    const handlePlayCard = async (card) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:3000/api/gamerooms/play-card/${roomId}`,
                { card },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Card played successfully!');
            socket.emit('playCard', { roomId, card });
        } catch (error) {
            console.error('Error playing card:', error);
        }
    };

    const handleRestartGame = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/gamerooms/restart-game/${roomId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Game restarted successfully!');
        } catch (error) {
            console.error('Error restarting game:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Holland Kocsma</h1>
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            {gameState && (
                <PlayerOrder players={gameState.players} currentPlayer={gameState.currentPlayer} />
            )}
            {hand.length > 0 && <PlayCard hand={hand} onPlayCard={handlePlayCard} />}
            <Chat roomId={roomId} />
            <button
                onClick={handleRestartGame}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Restart Game
            </button>
            </div>
        </div>
    );
};

export default GameRoom;