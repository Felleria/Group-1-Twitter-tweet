import React, { useState, useEffect } from 'react';
import './App.css';
import Tweet from './components/Tweet.jsx'

const App = () => {
    // State to hold the list of tweets and the new tweet content
    const [tweets, setTweets] = useState([]);
    const [newTweetContent, setNewTweetContent] = useState('');

    // Fetch tweets from the API
    useEffect(() => {
        fetch('http://localhost:3000/tweets')

            .then((response) => response.json())
            .then((data) => {
                setTweets(data);
            })
            .catch((error) => console.error('Error fetching tweets:', error));
    }, []);

    // Handle new tweet input change
    const handleNewTweetChange = (e) => {
        setNewTweetContent(e.target.value);
    };

    // Add a new tweet
    const addNewTweet = (e) => {
        e.preventDefault();
        const newTweet = {
            id: Date.now(),
            user: 'Anonymous',  
            username: '@anonymous',
            content: newTweetContent,
            date: new Date().toLocaleString(),
        };
        
        // Send a POST request to add the new tweet to the server
        fetch(`/api/tweets`, 
        { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTweet),
        })
            .then((response) => response.json())
            .then((data) => {
                setTweets([data, ...tweets]);
                setNewTweetContent('');
            })
            .catch((error) => console.error('Error adding tweet:', error));
    };

    // Delete a tweet
    const handleDelete = (id) => {
        // Send a DELETE request to remove the tweet from the server
        fetch(`/api/tweets/${id}`, {  
            method: 'DELETE',
        })
            .then(() => {
                const updatedTweets = tweets.filter((tweet) => tweet.id !== id);
                setTweets(updatedTweets);
            })
            .catch((error) => console.error('Error deleting tweet:', error));
    };

    // Handle tweet update
        const handleUpdate = (updatedTweet) => {
            // Find the index of the updated tweet in the list
            const index = tweets.findIndex((tweet) => tweet.id === updatedTweet.id);
            // Create a copy of the tweets array
            const updatedTweets = [...tweets];
            // Replace the old tweet with the updated tweet
            updatedTweets[index] = updatedTweet;
            // Update the state with the new tweets array
            setTweets(updatedTweets);
        };

    return (
        <div className="app">
            {/* Form for adding a new tweet */}
            <form onSubmit={addNewTweet}>
                <input
                    type="text"
                    value={newTweetContent}
                    onChange={handleNewTweetChange}
                    placeholder="What's happening?"
                    required
                />
                <button type="submit">Tweet</button>
            </form>
            {/* Displaying the list of tweets */}
            {tweets.map((tweet) => (
               <Tweet key={tweet.id} tweet={tweet} onDelete={handleDelete} onUpdate={handleUpdate} onSubmit={addNewTweet} />
            ))}
        </div>
    );
};

export default App;
