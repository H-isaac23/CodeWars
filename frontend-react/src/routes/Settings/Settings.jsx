import React, { useState } from "react";
import "./Settings.css";
import bg from "../../assets/img/4455.jpg";
import { Link } from "react-router-dom";
import Contact from "../ContactUs/Contact";
import About from "../About/About";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConfigStore from "../../store/configStore";
import AudioButton from "../../components/AudioButton/AudioButton";

export default function settings({isTransparent, showSettings}) {
  const account = useConfigStore((state) => state.account);
  const navigate = useNavigate();
  const [about, showAbout] = useState(false);
  const [contact, showContact] = useState(false);

  useEffect(() => {
    if (account.username === "") {
      navigate("/");
    }
  });

  const toggleAbout = () => {
    showAbout(true);
  };

  const toggleContact = () => {
    showContact(true);
  };

  const toggleReturn = () => {
    showReturn(true);
  };


  return (
    <div className="container">
      {!isTransparent && <img src={bg} alt="bg"/>} 
      <div className={`Settings-box ${isTransparent ? "settings-pvp" : ""}`}>
        <h1>Game</h1>
        <h1>
          <span>Settings</span>
        </h1>
        <div className="audio">
          <p>MUSIC</p>
          <AudioButton />
        </div>
        <div className="audio">
          <p>SOUND</p>
          <div className="vol">
            <div className="vol-oval">ON</div>
            <div className="vol-circle"></div>
          </div>
        </div>
        
        <div className="first-line">
          <div onClick={toggleAbout}>
            { !isTransparent && <button className="btn"> ABOUT </button> }
          </div>
          <div onClick={toggleContact}>
            { !isTransparent && <button className="btn"> CONTACT </button> }
          </div>
        </div>
          <div onClick={() => showSettings(false)}>
            <button className="btn"> RETURN </button>
          </div>
      </div>
      {about && <div className="gameAbout">
        <About showAbout={showAbout}/>
      </div>}
      {contact && <div className="gameContact">
        <Contact showContact={showContact}/>
      </div>}
    </div>
  );
}
