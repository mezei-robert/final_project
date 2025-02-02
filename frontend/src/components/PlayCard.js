import React from 'react';

const PlayCard = ({ hand, onPlayCard }) => {
  const handlePlayCard = (card) => {
      onPlayCard(card);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Your Hand</h2>
      <div className="flex flex-wrap gap-4">
        {hand.map((card, index) => (
          <div
            key={index}
            onClick={() => handlePlayCard(card)}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-lg font-bold">
              {card.rank} of {card.suit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayCard;