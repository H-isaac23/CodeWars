import React from "react";
import dazai from "../../assets/img/dazai.png";
import "./Profile.css";
import { Link } from "react-router-dom";

export default function Profile({ username }) {
  return (
      <div>
        <div className="t-profile"></div>
        <div className="profile">
          <div className="pimage">
            <img src={dazai} />
          </div>
          <div className="nameid">
            <p>{username}</p>
            <small>Gold: 500</small>
          </div>
        </div>
      </div>
  );
}
