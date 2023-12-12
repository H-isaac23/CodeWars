import { useEffect, useState } from "react";
import React from "react";
import "./Match.css";
import glass from "../../assets/img/manifyglass.png";
import { socket } from "../../socket";
import { FaSearch } from "react-icons/fa";
import useConfigStore from "../../store/configStore";

export default function Match({ showFind, findMatch, onSocketDisconnect }) {
  const account = useConfigStore((state) => state.account);

  const onCancel = () => {
    findMatch(false);
    socket.emit("queue", {
      findMatch: false,
      username: account.username,
      stars: account.stars,
    });
  };

  useEffect(() => {
    socket.on("disconnect", () => {
      findMatch(false);
      onSocketDisconnect();
    });
  }, []);
  return (
    <>
      {showFind && (
        <div className="match-container">
          <div className="magnifyglass">
            <FaSearch className="search-icon" />
          </div>
          <h1>
            Finding Opponent<span>.</span>
            <span>.</span>
            <span>.</span>
          </h1>
          <div className="btn cancelbtn" onClick={onCancel}>
            CANCEL
          </div>
        </div>
      )}
    </>
  );
}
