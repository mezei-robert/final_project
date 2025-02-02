const findStartingPlayer = (players) => {
    let startingPlayer = players[0];
    let smallestCard = startingPlayer.hand[0];

    players.forEach((player) => {
        player.hand.forEach((card) => {
            if (card.rank < smallestCard.rank) {
                smallestCard = card;
                startingPlayer = player;
            }
        });
    });

    return startingPlayer;
};

const canPlayCard = (currentCard, playedCard) => {
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    //kepessegel rendelkezo kartyak
    if (playedCard.rank === 'Joker') {
        return false;
    }
    if (playedCard.rank === '2') {
        return true;
    }
    if (playedCard.rank === '5') {
        return (
            rankOrder.indexOf(currentCard.rank) <= rankOrder.indexOf('5') ||
            currentCard.rank === '2' ||
            currentCard.rank === '5' ||
            currentCard.rank === '10' ||
            currentCard.rank === 'Joker'
        );
    }
    if (playedCard.rank === '10') {
        return false;
    }

    //Normal lapok
    return rankOrder.indexOf(currentCard.rank) >= rankOrder.indexOf(playedCard.rank);
};

export default { findStartingPlayer, canPlayCard };