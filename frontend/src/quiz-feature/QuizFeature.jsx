import React, { useState, useEffect } from 'react';
import './style/QuizFeature.css';
import useCardActions from '../hooks/useCardActions';

function QuizFeature({ deck }) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const [quizingCards, setCards] = useState([]);

    const { getCards, addCard, updateCard, deleteCard, generateCardsFromPDF } = useCardActions();



    useEffect(() => {
        const loadCards = async () => {
            if (!deck) {
                return;
            }

            try {
                const cardData = await getCards(deck.id);
               

                // Mapping the card data:
                const mappedCards = cardData.map(card => ({
                    id: card.cardID || card.id,
                    question: card.qSide,
                    answer: card.aSide
                }));

               
                setCards(mappedCards);
            }
            catch (error) {
                console.error('Error loading cards:', error);
            }
        };

        loadCards();
    }, [deck, getCards]);



    const currentCard = quizingCards[currentCardIndex];


    // Safety check.
    if (!currentCard) {
        return (
            <div className="quiz-container">
                <div className="quiz-header">
                    <h2>Loading cards...</h2>
                </div>
            </div>
        );
    }


    const handleCardFlip = () => {
        setIsFlipped(!isFlipped);
    };



    const handleCorrect = () => {
        setScore(score + 1);
        handleNextCard();
    };



    const handleIncorrect = () => {
        handleNextCard();
    };



    const handleNextCard = () => {
        if (currentCardIndex + 1 < quizingCards.length) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        } else {
            setShowResults(true);
        }
    };



    const resetQuiz = () => {
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setScore(0);
        setShowResults(false);
    };




    if (showResults) {
        return (
            <div className="quiz-container">
                <div className="quiz-results">
                    <h2>Quiz Complete!</h2>
                    <p>Your Score: {score} out of {quizingCards.length}</p>
                    <p>Percentage: {Math.round((score / quizingCards.length) * 100)}%</p>
                    <button onClick={resetQuiz} className="restart-btn">
                        Take Quiz Again
                    </button>
                </div>
            </div>
        );
    }



    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h2>Flashcard Quiz</h2>
                <div className="progress">
                    Card {currentCardIndex + 1} of {quizingCards.length}
                </div>
            </div>

            <div className="card-section">
                <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
                    <div className="card-front">
                        <div className="card-content">
                            <h3>Question</h3>
                            <p>{currentCard.question}</p>
                        </div>
                        <div className="flip-hint">Click to reveal answer</div>
                    </div>
                    <div className="card-back">
                        <div className="card-content">
                            <h3>Answer</h3>
                            <p>{currentCard.answer}</p>
                        </div>
                        <div className="flip-hint">Click to go back to question</div>
                    </div>
                </div>

                {isFlipped && (
                    <div className="answer-buttons">
                        <button className="correct-btn" onClick={handleCorrect}>
                            ✓ I got it right
                        </button>
                        <button className="incorrect-btn" onClick={handleIncorrect}>
                            ✗ I got it wrong
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizFeature;