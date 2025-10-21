/*
Author: Bo Wang
Date: 10/12/25
Description: CoursePage component to display decks within a course and allow adding and managing decks.
*/
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Navigation.css";

function CoursePage() {
    // Get courseId from URL parameters
    const { courseId } = useParams();
    // Sample data for decks in the course
    const [decks, setDecks] = useState([
        { id: 1, name: "Algebra", description: "Basic algebra concepts.", cardCount: 10 },
        { id: 2, name: "Geometry", description: "Shapes and theorems.", cardCount: 8 },
        { id: 3, name: "Calculus", description: "Limits and derivatives.", cardCount: 12 },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [newDeckName, setNewDeckName] = useState("");
    const [newDescription, setNewDescription] = useState("");


    function addDeck() {

        // Create new deck object
        const newDeck = {
            id: decks.length + 1, // Backend will generate unique ID, so this is just for frontend purposes
            name: newDeckName,
            description: newDescription,
            cardCount: 0,
        };

        // Deck name validation
        if (newDeckName.trim() === "") {
            alert("Please enter a deck name.");
            return;
        } else if (decks.some(deck => deck.name.toLowerCase() === newDeckName.toLowerCase())) {
            alert("Deck with this name already exists.");
            return;
        }

        // Add new deck to the list
        setDecks([...decks, newDeck]);

        setNewDeckName(""); // Clear input field
        setNewDescription(""); // Clear description field

        // Hide form
        setShowForm(false);
    }

    // Function to delete a deck
    const deleteDeck = (deckId) => {
        const updatedDecks = decks.filter(deck => deck.id !== deckId);
        setDecks(updatedDecks);
    };

    return (
        <div className="course-page">
            <Link to="/dashboard" className="back-button">Back to All Courses</Link>
            <button onClick={() => setShowForm(true)} className="add-deck-button">+ Add New Deck</button>
            {showForm && (
                <div className="deck-form">
                    <input
                        type="text"
                        placeholder="Deck Name"
                        value={newDeckName}
                        onChange={(e) => setNewDeckName(e.target.value)}
                    />
                    <textarea placeholder="Deck Description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}></textarea>
                    <button onClick={addDeck}>Add Deck</button>
                    <button onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            )}
            <h1>Course ID: {courseId}</h1>
            <h2>Decks in this course:</h2>
            {decks.map((deck) => (
                <div key={deck.id} className="deck-card">
                    <Link to={`/dashboard/course/${courseId}/deck/${deck.id}`}>
                        <h3>{deck.name}</h3>
                        <p>{deck.description}</p>
                        <p>Cards: {deck.cardCount}</p>
                    </Link>
                    <button onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the Link navigation
                        deleteDeck(deck.id);
                    }} className="delete-button">Delete</button>
                </div>
            ))}
        </div>
    );
}

export default CoursePage;