import React, { useState } from "react";
import Leaderboards from "../../components/Leaderboards/Leaderboards";
import Profile from "../../components/Profile/Profile";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import UserProfile from "../../components/UserProfile/UserProfile";
import BattleCharacter from "../../components/BattleCharacter/BattleCharacter";
import Match from "../../components/Match/Match";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import "./Home.css";
import MatchHistory from "../../components/MatchHistory/MatchHistory";
// import bg from "../../assets/img/4455.jpg";
// import bg1 from "../../assets/img/ancient_rome.jpg";
import bg2 from "../../assets/img/bg2.jpg";
// import bg3 from "../../assets/img/bg3.jpg";
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

  // const backgroundImages = [
  //   bg,bg1,bg2,bg3
  // ];

  const notify = () => toast("Socket forcefully disconnected.");

  const [find, findMatch] = useState(false);
  const [profile, showProfile] = useState(false);
  const [matchHistory, showMatchHistory] = useState(false);
  // const [backgroundIndex, setBackgroundIndex] = useState(
  //   Math.floor(Math.random() * backgroundImages.length)
  // );
  const [loadingCount, isLoadingCount] = useState(0);

  useEffect(() => {
    if (account.username === "") {
      navigate("/");
    }

    socket.connect();
  }, [account.username]);

  if (socket.id) {
    console.log(socket.id);
  }

  const toggleProfile = () => {
    showProfile(true);
  };
  const toggleMatchHistory = () => { showMatchHistory(true); };
  return (
    <div className="container">
      <img src={bg2} alt="" />
      {/* {isLoadingCount<=1 && <LoadingPage />} */}
      <Match
        showFind={find}
        findMatch={findMatch}
        onSocketDisconnect={notify}
      />
      <div onClick={toggleProfile}>
        <Profile username={account.username} />
      </div>
      <div className="container-box">
        <BattleCharacter findMatch={findMatch} />
        <Leaderboards />
      </div>
      <div className="one" onClick={toggleMatchHistory}>
        Match History
      </div>
      {matchHistory && <MatchHistory showMatchHistory={showMatchHistory}/> }
      <ToastContainer />
      {profile && (
        <div className="userProfile">
          <UserProfile showProfile={showProfile} />
        </div>
      )}
    </div>
  );
}
