import React from 'react';

const PlayerOrder = ({ players, currentPlayer }) => {
    return (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Player Order</h3>
          <ul>
            {players.map((player, index) => (
              <li
                key={index}
                className={`mb-2 ${player.userId === currentPlayer ? 'font-bold text-blue-600' : 'text-gray-700'}`}
              >
                {player.username} {player.userId === currentPlayer && '(Current Player)'}
              </li>
            ))}
          </ul>
        </div>
    );
};

export default PlayerOrder;