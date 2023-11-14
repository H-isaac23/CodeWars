import React from "react";
import gold from "../../assets/img/gold.png";
import silver from "../../assets/img/silver.png";
import bronze from "../../assets/img/bronze.png";
import "./Leaderboards.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboards() {
  const [topPlayers, setTopPlayers] = useState([]);

  const getPlayers = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_URL_PREFIX}:3000/public/v1/account`
    );
    console.log(res.data);
    const players = res.data.content;
    players.sort((a, b) => {
      return b.stars - a.stars;
    });
    0(players);
  };

  useEffect(() => {
    getPlayers();
  }, []);

  console.log(topPlayers);
  return (
    <>
      {topPlayers.length > 0 && (
        <div className="lboards">
          <div className="lboards-title">
            <h1>LEADER</h1>
            <h1>
              <span>BOARDS</span>
            </h1>
          </div>
          <div className="placement">
            <div className="silver">
              <div className="silver-img">
                <img src={silver} />
              </div>
              <div className="text">
                <h3>2ND</h3>
                <h2>
                  {topPlayers[1] !== undefined ? topPlayers[1].username : "N/A"}
                </h2>
              </div>
              <div className="lboardstar">
                <p className="lstar"> &#9733;</p>
                <p>{topPlayers[1] !== undefined ? topPlayers[1].stars : "0"}</p>
              </div>
            </div>
            <div className="gold">
              <div className="gold-img">
                <img src={gold} alt="" />
              </div>
              <div className="text">
                <h3>1ST</h3>
                <h2>
                  {topPlayers[0] !== undefined ? topPlayers[0].username : "N/A"}
                </h2>
              </div>
              <div className="lboardstar">
                <p className="lstar"> &#9733;</p>
                <p>{topPlayers[0] !== undefined ? topPlayers[0].stars : "0"}</p>
              </div>
            </div>
            <div className="bronze">
              <div className="bronze-img">
                <img src={bronze} alt="" />
              </div>
              <div className="text">
                <h3>3RD</h3>
                <h2>
                  {topPlayers[2] !== undefined ? topPlayers[2].username : "N/A"}
                </h2>
              </div>
              <div className="lboardstar">
                <p className="lstar"> &#9733;</p>
                <p>{topPlayers[2] !== undefined ? topPlayers[2].stars : "0"}</p>
              </div>
            </div>
          </div>
          <div className="other-place">
            <div className="other-place-content">
              <p>
                4.{" "}
                {topPlayers[3] !== undefined ? topPlayers[3].username : "N/A"}
              </p>
              <div className="lboardstar">
                <p className="lstar"> &#9733;</p>
                <p>{topPlayers[3] !== undefined ? topPlayers[3].stars : "0"}</p>
              </div>
            </div>
            <div className="other-place-content">
              <p>
                5.{" "}
                {topPlayers[4] !== undefined ? topPlayers[4].username : "N/A"}
              </p>
              <div className="lboardstar">
                <p className="lstar"> &#9733;</p>
                <p>{topPlayers[4] !== undefined ? topPlayers[4].stars : "0"}</p>
              </div>
            </div>
            <div className="other-place-content">
              <p>
                6.{" "}
                {topPlayers[5] !== undefined ? topPlayers[5].username : "N/A"}
              </p>
              <div className="lboardstar">
                <p className="lstar"> &#9733;</p>
                <p>{topPlayers[5] !== undefined ? topPlayers[5].stars : "0"}</p>
              </div>
            </div>
            <div className="other-place-content">
              <p>
                7.{" "}
                {topPlayers[6] !== undefined ? topPlayers[6].username : "N/A"}
              </p>
              <div className="lboardstar">
                <p className="lstar"> &#9733;</p>
                <p>{topPlayers[6] !== undefined ? topPlayers[6].stars : "0"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
