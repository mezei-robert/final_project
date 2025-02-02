import React, { useState } from 'react';

const SelectCards = ({ cards, onSelect }) => {
    const [selectedCards, setSelectedCard] = useState([]);

    const handleSelectCard = (card) => {
        if (selectedCards.includes(card)) {
            setSelectedCard(selectedCards.filter((c) => c !== card));   // Ha a kártya már ki van választva, eltávolítjuk
        } else if (selectedCards.length < 3) {  // Maximum 3 kártyát lehet kiválasztani
            setSelectedCard([...selectedCards, card]);
        }
    };

    const handleConfirm = () => {
        onSelect(selectedCards);
    };

    return (
        <div>
          <h2>Select 3 Cards</h2>
          <div>
            {hand.map((card, index) => (
              <div
                key={index}
                onClick={() => handleSelectCard(card)}
                style={{
                  border: selectedCards.includes(card) ? '2px solid blue' : '1px solid black',
                  padding: '10px',
                  margin: '5px',
                  cursor: 'pointer',
                }}
              >
                {card.rank} of {card.suit}
              </div>
            ))}
          </div>
          <button onClick={handleConfirm} disabled={selectedCards.length !== 3}>
            Confirm Selection
          </button>
        </div>
    );
};

export default SelectCards;