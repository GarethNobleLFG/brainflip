/*
Author: Bo Wang, Gareth Noble
Last Updated: 11/4/25
Description: DeckPage component to display cards within a deck and allow adding and managing cards.
*/


import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/DeckPage.css";
import useItemManager from "../hooks/useItemManager";
import AddItemForm from "../components/AddItemForm";

function EditableCard({ card, onDelete, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ front: card.front, back: card.back });

    const handleChange = (field, value) => setEditValues({ ...editValues, [field]: value });

    return (
        <div className="card-container">
            <div className="card-content">
                {isEditing ? (
                    <>
                        <textarea
                            value={editValues.front}
                            onChange={(e) => handleChange("front", e.target.value)}
                            placeholder="Front side"
                            className="card-textarea"
                        />
                        <textarea
                            value={editValues.back}
                            onChange={(e) => handleChange("back", e.target.value)}
                            placeholder="Back side"
                            className="card-textarea"
                        />
                    </>
                ) : (
                    <>
                        <h3 className="card-question">Q: {card.front}</h3>
                        <p className="card-answer">A: {card.back}</p>
                    </>
                )}
            </div>

            <div className="card-buttons">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => {
                                onSave(editValues);
                                setIsEditing(false);
                            }}
                            className="btn btn-save"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="btn btn-cancel"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-edit"
                        >
                            Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className="btn btn-delete"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}




function PDFModal({ isOpen, onClose, onSubmit }) {
    const [pdfFile, setPdfFile] = useState(null);
    const [numFlashcards, setNumFlashcards] = useState(10);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pdfFile) {
            onSubmit(pdfFile, numFlashcards);
            setPdfFile(null);
            setNumFlashcards(10);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Generate Cards from PDF</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="pdf-upload">Select PDF File:</label>
                        <input
                            type="file"
                            id="pdf-upload"
                            accept=".pdf"
                            onChange={(e) => setPdfFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="num-cards">Number of Flashcards:</label>
                        <input
                            type="number"
                            id="num-cards"
                            min="1"
                            max="50"
                            value={numFlashcards}
                            onChange={(e) => setNumFlashcards(parseInt(e.target.value))}
                            required
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary">
                            Generate Cards
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-cancel">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


function ShareModal({ isOpen, onClose, onSubmit }) {
    const [recipientEmail, setRecipientEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (recipientEmail) {
            setIsLoading(true);
            await onSubmit(recipientEmail);
            setIsLoading(false);
            setRecipientEmail("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Share Deck</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="recipient-email">Recipient Email:</label>
                        <input
                            type="email"
                            id="recipient-email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? "Sharing..." : "Share"}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-cancel" disabled={isLoading}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}




function DeckPage() {
    const { deckId } = useParams();
    const { items: cards, addItem: addCard, deleteItem: deleteCard, updateItem: editCard } = useItemManager([
        { id: 1, front: "What is React?", back: "A JavaScript library for building UIs." },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({ front: "", back: "" });
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleAdd = () => {
        addCard({ front: formValues.front, back: formValues.back });
        setFormValues({ front: "", back: "" });
        setShowForm(false);
    };


    const handlePDFSubmit = async (pdfFile, numFlashcards) => {
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('numFlashcards', numFlashcards);

        try {
            const response = await fetch(`http://localhost:5000/api/cards/generate`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {

                data.flashcards.forEach((card, index) => {
                    console.log(`Adding card ${index + 1}:`, card);
                    const newCard = {
                        front: card.question,
                        back: card.answer
                    };
                    console.log('Formatted card:', newCard);
                    addCard(newCard);
                });

                alert(`Successfully generated ${data.flashcards.length} flashcards!`);

            }

            else {
                alert(`Error: ${data.error}`);
            }


        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('Failed to generate flashcards. Please try again.');
        }
    };


    const handleShareSubmit = async (recipientEmail) => {
        // Frontend testing - just show success message
        alert(`Deck shared successfully with ${recipientEmail}!`);
        console.log(`[Frontend Test] Deck ${deckId} would be shared with ${recipientEmail}`);

        // Uncomment below to enable backend integration when ready
        /*
        try {
            const response = await fetch(`http://localhost:5000/api/decks/${deckId}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipientEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Deck shared successfully with ${recipientEmail}!`);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error sharing deck:', error);
            alert('Failed to share deck. Please try again.');
        }
        */
    };


    const handleToggleFavorite = async () => {
        // Toggle favorite in local state immediately (for frontend testing)
        setIsFavorite(!isFavorite);

        // Uncomment below to enable backend integration when ready
        /*
        try {
            const response = await fetch(`http://localhost:5000/api/decks/${deckId}/favorite`, {
                method: 'PUT',
            });

            const data = await response.json();

            if (response.ok) {
                setIsFavorite(data.deck.isFavorite);
            } else {
                console.error('API Error:', data.error);
                alert(`Error: ${data.error}`);
                // Revert on error
                setIsFavorite(isFavorite);
            }
        } catch (error) {
            console.error('Network error toggling favorite:', error);
            alert('Failed to connect to server.');
            // Revert on error
            setIsFavorite(isFavorite);
        }
        */
    };



    return (
        <div className="deck-page">
            <Link to="/dashboard" className="back-button">← Back to All Decks</Link>

            <h1>Deck ID: {deckId}</h1>
            <button onClick={() => setShowForm(true)}>+ Add Card</button>

            <button
                onClick={() => setShowPDFModal(true)}
                className="btn-pdf"
            >
                + Generate Cards From PDF
            </button>

            <button
                onClick={() => setShowShareModal(true)}
                className="btn-share"
            >
                Share Deck
            </button>

            <button
                onClick={handleToggleFavorite}
                className={isFavorite ? "btn-favorite-active" : "btn-favorite"}
            >
                {isFavorite ? "★ Favorited" : "☆ Favorite"}
            </button>


            {showForm && (
                <AddItemForm
                    fields={[
                        { name: "front", placeholder: "Card Front" },
                        { name: "back", placeholder: "Card Back" },
                    ]}
                    values={formValues}
                    onChange={(field, value) => setFormValues({ ...formValues, [field]: value })}
                    onSubmit={handleAdd}
                    onCancel={() => setShowForm(false)}
                />
            )}


            <PDFModal
                isOpen={showPDFModal}
                onClose={() => setShowPDFModal(false)}
                onSubmit={handlePDFSubmit}
            />

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                onSubmit={handleShareSubmit}
            />

            <div className="cards-grid">
                {cards.map((card) => (
                    <EditableCard
                        key={card.id}
                        card={card}
                        onDelete={() => deleteCard(card.id)}
                        onSave={(updated) => editCard(card.id, updated)}
                    />
                ))}
            </div>
        </div>
    );
}

export default DeckPage;
