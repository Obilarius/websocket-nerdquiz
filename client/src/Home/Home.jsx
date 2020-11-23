import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [roomName, setRoomName] = React.useState("");

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  return (
    <div className="homeContainer">
      <div className="joinRoomWrapper">
        <input
          type="text"
          placeholder="Room"
          value={roomName}
          onChange={handleRoomNameChange}
          className="text-input-field"
        />
        <Link to={`/${roomName}`} className="enter-room-button">
          <button>Raum Betreten</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;