import React from "react";
import axios from "axios";

const StartGameButton = ({ roomId }) => {
    const handleStartGame = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:3000/api/gamerooms/start/${roomId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Game started:", response.data);
        } catch (error) {
            console.error("Error starting game:", error);
        }
    };

    return <button onClick={handleStartGame}>Start Game</button>;
};

export default StartGameButton;