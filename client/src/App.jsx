import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const ENDPOINT = "http://127.0.0.1:4000";

function App() {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const sock = socketIOClient(ENDPOINT);
    setSocket(sock);
    sock.on("ClientId", (guid) => {
      console.log(guid);
    });
    sock.on("ChatMessage", (msg) => {
      setMessages((messages) => [...messages, msg]);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit("ChatMessage", message);
    setMessage("");
  };

  return (
    <div className="App">
      <ul id="messages"></ul>
      <form onSubmit={handleSubmit}>
        <input
          id="message"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default App;
