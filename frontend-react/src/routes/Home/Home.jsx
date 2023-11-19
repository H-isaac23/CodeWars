import React, { useState } from "react";
import Leaderboards from "../../components/Leaderboards/Leaderboards";
import Profile from "../../components/Profile/Profile";
import BattleCharacter from "../../components/BattleCharacter/BattleCharacter";
import Match from "../../components/Match/Match";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import "./Home.css";
import bg from "../../assets/img/4455.jpg";
import bg1 from "../../assets/img/ancient_rome.jpg";
import bg2 from "../../assets/img/bg2.jpg";
import bg3 from "../../assets/img/bg3.jpg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useConfigStore from "../../store/configStore";

export default function Home() {
  const navigate = useNavigate();
  const account = useConfigStore((state) => state.account);
  const isConnected = useConfigStore((state) => state.isConnected);
  console.log(account);

  const backgroundImages = [
    bg,bg1,bg2,bg3
  ];

  const notify = () => toast("Socket forcefully disconnected.");

  const [find, findMatch] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(
    Math.floor(Math.random() * backgroundImages.length)
  );
  const [loadingCount, isLoadingCount] = useState(0);

  useEffect(() => {
    if (account.username === "") {
      navigate("/");
    }

    socket.connect();
    isLoadingCount(loadingCount + 1);
  }, []);

  if (socket.id) {
    console.log(socket.id);
  }

  return (
    <div className="container">
      <img src={backgroundImages[backgroundIndex]} alt="" />
      {isLoadingCount<=1 && <LoadingPage />}
      <Match
        showFind={find}
        findMatch={findMatch}
        onSocketDisconnect={notify}
      />
      <Profile username={account.username} />
      <div className="container-box">
        <BattleCharacter findMatch={findMatch} />
        <Leaderboards />
      </div>
      <ToastContainer />
    </div>
  );
}
