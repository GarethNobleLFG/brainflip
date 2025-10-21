/*
Author: Bo Wang
Date: 10/12/25
Description: DeckPage component to display cards within a deck and allow adding and managing cards.
*/
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

function DeckPage() {
    // Get courseId and deckId from URL parameters
    const { courseId, deckId } = useParams();

    // Sample data for cards in the deck
    const [cards, setCards] = useState([
        { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces." },
    ]);


    const [form, setForm] = useState(false);// State for showing/hiding card creation form
    const [cardFront, setCardFront] = useState("");// State for new card inputs
    const [cardBack, setCardBack] = useState("");// State for new card back input
    const [isSelectedMode, setIsSelectedMode] = useState(false); // State to track if selection mode is active
    const [selectedCards, setSelectedCards] = useState([]); // State to track selected cards and array will contain card ids


    function createCard(e) {
        // Prevent form submission
        e.preventDefault();

        // Simple validation
        if (cardFront.trim() === "" || cardBack.trim() === "") {
            alert("Both front and back sides are required.");
            return;
        }

        const newCard = {
            id: cards.length + 1,
            front: cardFront,
            back: cardBack,
        };


        setCards([...cards, newCard]);
        setCardFront("");
        setCardBack("");
        setForm(false);
    }

    const deleteCard = (cardId) => {
        const updatedCards = cards.filter(card => card.id !== cardId);
        setCards(updatedCards);
    };

    const enterSelectionMode = () => {
        setIsSelectedMode(true);
        setSelectedCards([]); // Clear any previous selections
    }

    const cancelSelection = () => {
        setIsSelectedMode(false);
        setSelectedCards([]); // Clear selections when exiting
    }


    // handle checkbox change event
    const handleDeleteSelected = () => {
        const updatedCards = cards.filter(card => !selectedCards.includes(card.id));
        setCards(updatedCards);
        setIsSelectedMode(false); // Exit selection mode after deletion
        setSelectedCards([]); // Clear selection after deletion
    }

    // if cardId is already in selectedCards, remove it; otherwise, add it
    const checkboxHandler = (cardId) => {
        if (selectedCards.includes(cardId)) {
            setSelectedCards(selectedCards.filter(id => id !== cardId));
        } else {
            setSelectedCards([...selectedCards, cardId]);
        }
    };

    return (
        <div className="deck-page">
            {/* Navigation back to course */}
            <Link to={`/dashboard/course/${courseId}`} className="back-button">Back to Course</Link>

            {/* Button to toggle card creation form */}
            <button onClick={() => setForm(true)} className="add-card-button"> + Add New Card</button>
            {/* Card creation form */}
            {form && (
                <div>
                    <textarea
                        placeholder="Front Side"
                        value={cardFront}
                        onChange={(e) => setCardFront(e.target.value)}
                    ></textarea>
                    <br />
                    <textarea
                        placeholder="Back Side"
                        value={cardBack}
                        onChange={(e) => setCardBack(e.target.value)}
                    ></textarea>
                    <button onClick={createCard}>Create Card</button>
                    <button onClick={() => setForm(false)}>Cancel</button>
                </div>
            )}
            {cards.length > 0 && (
                isSelectedMode ? (
                    <div className="selection-actions">
                        <button
                            onClick={handleDeleteSelected}
                            className="delete-selected-button"
                            disabled={selectedCards.length === 0}
                        >
                            Delete Selected ({selectedCards.length})
                        </button>
                        <button onClick={cancelSelection} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button onClick={enterSelectionMode} className="select-mode-button">
                        Select Multiple
                    </button>
                )
            )}


            {/* Display cards in the deck */}
            <h1>Course ID: {courseId}</h1>
            <h2>Deck ID: {deckId}</h2>
            <h3>Cards in this deck:</h3>
            {cards.map((card) => (
                <div key={card.id} className="deck-card">
                    {isSelectedMode && (
                        <input
                            type="checkbox"
                            checked={selectedCards.includes(card.id)}
                            onChange={() => checkboxHandler(card.id)}
                            className="card-checkbox"
                        />
                    )}
                    <h4>Q: {card.front}</h4>
                    <p>A: {card.back}</p>

                    {!isSelectedMode && (
                        <button onClick={(e) => {
                            e.stopPropagation(); // Prevent any parent handlers from being notified of the event
                            deleteCard(card.id);
                        }} className="delete-button">Delete</button>
                    )}
                </div>

            ))}
        </div>
    );
}

export default DeckPage;