import React from "react";
import axios from "axios";

const JoinRoomButton = ({ roomId }) => {
    const handleJoinRoom = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:3000/api/gamerooms/join/${roomId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Joined room:", response.data);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    return <button onClick={handleJoinRoom}>Join Room</button>;
};

export default JoinRoomButton;