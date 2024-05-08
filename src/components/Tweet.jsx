// Function to handle the edit button click
const handleEditClick = () => {
    setIsEditing(true);
};

// Function to handle the change in the input field
const handleContentChange = (e) => {
    setEditedContent(e.target.value);
};

// Function to handle the submission of the edited tweet
const handleEditSubmit = (e) => {
    e.preventDefault();

    // Make a PUT request to update the tweet on the server
    fetch(`/api/tweets/${tweet.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
    })
        .then((response) => response.json())
        .then((updatedTweet) => {
            // Update the tweet in the client state
            onUpdate(updatedTweet);
            // Exit editing mode
            setIsEditing(false);
        })
        .catch((error) => console.error('Error updating tweet:', error));
};

return (
    <div className="tweet">
        {isEditing ? (
            // If in editing mode, show an input field with the current tweet content
            <form onSubmit={handleEditSubmit}>
                <input
                    type="text"
                    value={editedContent}
                    onChange={handleContentChange}
                    className="edit-input"
                />
                <button type="submit">Save</button>
                {/* Cancel editing mode */}
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
        ) : (
            // If not in editing mode, show the tweet content
            <>
                <h3>{tweet.user} <span>{tweet.username}</span></h3>
                <p>{tweet.content}</p>
                <small>{tweet.date}</small>
                <div className="tweet-buttons">
                    <button onClick={() => handleEditClick()}>Edit</button>
                    <button onClick={() => onDelete(tweet.id)}>Delete</button>
                </div>
            </>
        )}
    </div>
);