import React from "react";
import "./UserProfile.css";
import bg from "../../assets/img/bg2.jpg";
import Settings from "../Settings/Settings";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import useConfigStore from "../../store/configStore";
import MatchHistory from "../../components/MatchHistory/MatchHistory";

export default function UserProfile({showProfile}) {
  const navigate = useNavigate();
  const account = useConfigStore((state) => state.account);
  const removeAccount = useConfigStore((state) => state.removeAccount);
  const toggle = useConfigStore((state) => state.togglePlaying);
  const isPlaying = useConfigStore((state) => state.isPlaying);
  const [settings, showSettings] = useState(false);
  const [matchHistory, showMatchHistory] = useState(false);
  
  useEffect(() => {
    if (account.username === "") {
      navigate("/");
    }
  },[]);
  
  const onLogout = () => {
    removeAccount();
    socket.disconnect();
    window.localStorage.clear();
    if (isPlaying) {
      toggle();
    }
    navigate("/");
  };
  
  const toggleSettings = () => {
    showSettings(true);
  };

  const toggleMatchHistory = () => { showMatchHistory(true); };

  return (
    <div className="profile-container">
      <img src={bg} alt="bg" />
      <div className="profile-box">
        <h1>User</h1>
        <h1>
          <span>Profile</span>
        </h1>

        <div className="user-profile">
          <div className="user-info">
            <p>USERNAME:</p>
            <p>{account.username}</p>
          </div>
          <div className="user-info">
            <p>USER ID:</p>
            <p>123123</p>
          </div>
          <div className="user-info">
            <p>Email:</p>
            <p>{account.email}</p>
          </div>
        </div>
        
        <div className="first-line">
          <div onClick={toggleSettings}>
            <button className="btn">SETTINGS</button>
          </div>
          <div onClick={toggleMatchHistory}>
            <button className="btn">
              HISTORY
            </button>
          </div>
        </div>
        <div className="first-line fbottom">
          <Link to="/">
            <button className="btn" onClick={onLogout}>
              LOGOUT
            </button>
          </Link>
          <div onClick={() => showProfile(false)}>
            <button className="btn"> RETURN </button>
          </div>
        </div>
        </div>
      {matchHistory && <MatchHistory showMatchHistory={showMatchHistory}/> }
      {settings && <div className="userSettings">
        <Settings showSettings={showSettings}/>
      </div>}
    </div>
  );
}
