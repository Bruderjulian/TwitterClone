import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const url = "http://localhost:3000";
const socket = io(url);

export default function TweetFeed() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // Load existing tweets
    fetch(url + "/tweets")
      .then((res) => res.json())
      .then(setTweets);

    // Listen for tweets
    socket.on("tweet-posted", (tweet) => {
      setTweets((prev) => [tweet, ...prev]);
    });

    // Cleanup
    return () => {
      socket.off("tweet-posted");
    };
  }, []);

  function sendTweet() {
    // Get tweet text
    const tweetText = document.getElementById("tweet_text").value;
    if (!tweetText || tweetText == "") return;

    //Send tweet
    const tweet = {
      text: tweetText,
      timestamp: Date.now(),
    };
    socket.emit("new-tweet", tweet);

    //Clear textarea
    document.getElementById("tweet_text").value = "";
  }

  return (
    <>
      <h2>Live Tweets</h2>
      <textarea
        name="tweet_text"
        id="tweet_text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendTweet();
          }
        }}
      ></textarea>
      <br />
      <button onClick={sendTweet}>Send Tweet</button>
      {tweets.map((tweet, i) => (
        <div key={"tweet_" + i} className="tweet">
          <p>Text: {tweet.text}</p>
          <small>Date: {new Date(tweet.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </>
  );
}
