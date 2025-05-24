import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function TweetFeed() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // Load existing tweets
    fetch("http://localhost:3000/tweets")
      .then((res) => res.json())
      .then(setTweets);

    // Listen for tweets
    socket.on("tweet-posted", (tweet) => {
      setTweets((prev) => [tweet, ...prev]);
    });

    return () => socket.off("tweet-posted");
  }, []);

  return (
    <div>
      <h2>Live Tweets</h2>
      <textarea name="tweet_text" id="tweet_text"></textarea>
      <br />
      <button onClick={sendTweet}>Send Tweet</button>
      {tweets.map((tweet) => (
        <div>
          <p>Text: {tweet.text}</p>
          <small>Date: {new Date(tweet.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

function sendTweet() {
  const tweetText = document.getElementById("tweet_text").value;
  if (!tweetText) return;

  //Send tweet
  const tweet = {
    text: tweetText,
    timestamp: Date.now(),
  };
  socket.emit("new-tweet", tweet);

  //Clear textarea
  //document.getElementById("tweet_text").value = "";
}
