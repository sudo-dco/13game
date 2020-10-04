import React, { useState, useEffect } from 'react';
import Card from './Card.jsx';
import cardComparison from '../gameplay/cardComparison.js';
import multiplePatternCheck from '../gameplay/multiplePatternCheck.js';

const PlayerHand = ({ 
    decks,
    playedCards,
    setPlayedCards,
    setDecks,
    changePlayerTurn,
    currentPlayer,
    displayAlert,
    passTurn,
    openPlay,
    setOpenPlay,
    }) => {
    const [selectedCards, setSelectedCards] = useState([]);

    // handles removing cards from player hand and updating deck
    const playCards = (cards, pattern) => {
        const decksCopy = [...decks];
        const hand = decksCopy[currentPlayer];

        for (let i = 0; i < cards.length; i++) {
            const index = hand.indexOf(cards[i]); // find position of current card in hand
            hand.splice(index, 1); // splice current card from player hand
        }
        
        displayAlert('play', currentPlayer, cards);
        setPlayedCards({
            lastPlayedBy: currentPlayer,
            lastPlayedCards: cards,
            lastPattern: pattern,
            cardPile: [...playedCards.cards, ...cards]
        });

        return decksCopy;
    };

    // handles player selection of a individual card
    const handleCardClick = (card) => {
        const stateCopy = [...selectedCards];
        const previouslySelectedCard = stateCopy.indexOf(card);
        
        if (previouslySelectedCard === -1) {
            // selecting card
            stateCopy.push(card);
        } else {
            // unselecting card
            stateCopy.splice(previouslySelectedCard, 1);
        }

        setSelectedCards(stateCopy);
    };

    const handlePlayButton = () => {
        let verifyPlay = false;
        const results = {
            true: updateHandAndTurn(),
            false: displayAlert('invalid'),
            'length': displayAlert('length')
        };

        const updateHandAndTurn = () => {
            // check if selected cards are a valid pattern before playing them
            const pattern = multiplePatternCheck(selectedCards);
            
            if (pattern === false) {
                displayAlert('badPattern');
            } else {
                const hands = playCards(selectedCards, pattern);
                setDecks(hands);
                setSelectedCards([]);
    
                if (openPlay === true) {
                    setOpenPlay(false);
                }
    
                changePlayerTurn();
            }
        };

        /* only register clicks if it's player 0's turn, allow player 0 to play
        any card if it's open play on their turn */
        if (currentPlayer === 0 && openPlay === true) {
            updateHandAndTurn();
        }
        else if (currentPlayer === 0) {
            // if not open play, check card values first
            verifyPlay = cardComparison(selectedCards, playedCards.lastPlayedCards);
            results[verifyPlay];
        }
    };

    const handlePlayerPass = () => {
        if (currentPlayer === 0) {
            displayAlert('pass', currentPlayer);
            const count = passTurn();
            
            // only change player turn if there hasn't been 3 passes already
            if (count < 3) {
                changePlayerTurn();
            }
        }
    };

    useEffect(() => {
        if (openPlay === true && currentPlayer === 0) {
            displayAlert('open', currentPlayer);
        }
    }, [openPlay, currentPlayer]);

    useEffect(() => {
        // player 1's turn if their hand is empty
        if (decks[0].length === 0 && currentPlayer === 0) {
            changePlayerTurn();
        }
    }, [currentPlayer]);

    return (
        <div className='playerHand-container'>
            <h5>Your Hand:</h5>
            <div className='hand hhand-compact'>
                {decks[0].map((card, i) => (
                    <Card card={card} key={i} showFace={true} handleCardClick={handleCardClick} />
                ))}
            </div>
            <button type='button' onClick={handlePlayButton}>Play</button>
            <button type='button' onClick={handlePlayerPass}>Pass</button>
        </div>
    );
}

export default PlayerHand;