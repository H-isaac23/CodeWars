import React, { useState } from "react";
import "./Settings.css";
import bg from "../../assets/img/bg2.jpg";
import { Link } from "react-router-dom";
import Contact from "../ContactUs/Contact";
import About from "../About/About";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConfigStore from "../../store/configStore";
import AudioButton from "../../components/AudioButton/AudioButton";
import SoundButton from "../../components/SoundButton/SoundButton";

export default function settings({showSettings}) {
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
      <img src={bg} alt="bg"/>
      <div className="Settings-box">
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
          <SoundButton/>
        </div>
        
        <div className="first-line">
          <div onClick={toggleAbout}>
            <button className="btn"> ABOUT </button> 
          </div>
          <div onClick={toggleContact}>
            <button className="btn"> CONTACT </button> 
          </div>
        </div>
        <div className="first-line">
          <div>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfHhaXaRBjTZOQFTzWA5Alpg7oSuRu6eFfpsMSlYD6RARWHPw/viewform" target="_blank"><button className="btn"> RATING</button></a>
          </div>
          <div onClick={() => showSettings(false)}>
            <button className="btn"> RETURN </button>
          </div>
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
