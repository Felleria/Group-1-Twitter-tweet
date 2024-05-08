import React, { useState, useEffect } from 'react';
import Tweet from './Tweet';
import './App.css';

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [newTweetContent, setNewTweetContent] = useState('');

  // Fetch data from the API when the component mounts
  useEffect(() => {
      fetch('http://localhost:3031/tweets')
          .then((response) => response.json())
          .then((data) => {
              setTweets(data);
          })
          .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleNewTweetChange = (e) => {
      setNewTweetContent(e.target.value);
  };

  const addNewTweet = (e) => {
      e.preventDefault();
      const newTweet = {
          id: Date.now(),
          user: 'Asabeneh Yetayeh',
          username: '@Asabeneh',
          content: newTweetContent,
          date: new Date().toLocaleString(),
      };
      
      // Here, you can use the Fetch API to POST the new tweet to the server.
      fetch('/api/tweets', {
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

  const handleDelete = (id) => {
      // Use the Fetch API to DELETE the tweet from the server
      fetch(`/api/tweets/${id}`, {
          method: 'DELETE',
      })
          .then((response) => response.json())
          .then(() => {
              const updatedTweets = tweets.filter((tweet) => tweet.id !== id);
              setTweets(updatedTweets);
          })
          .catch((error) => console.error('Error deleting tweet:', error));
  };

  return (
      <div className="app">
          <form onSubmit={addNewTweet}>
              <input
                  type="text"
                  value={newTweetContent}
                  onChange={handleNewTweetChange}
                  placeholder="What's happening?"
                  className="input"
                  required
              />
              <button type="submit">Tweet</button>
          </form>
          {tweets.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} onDelete={handleDelete} />
          ))}
      </div>
  );
};

export default App;
