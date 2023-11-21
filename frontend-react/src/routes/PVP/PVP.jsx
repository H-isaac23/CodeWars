import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaCheck } from "react-icons/fa";
//thsi is
import useConfigStore from "../../store/configStore";
import AudioButton from "../../components/AudioButton/AudioButton";
import Settings from "../Settings/Settings";
import "./PVP.css";
import bg from "../../assets/img/4455.jpg";
import clock from "../../assets/img/clock.png";
import charMan from "../../assets/img/final_male_anim_IDLE.gif";
import charWoman from "../../assets/img/final_female_anim_IDLE(fixed frames).gif";
import setting from "../../assets/img/settingbtn.png";
import xbtn from "../../assets/img/x.png";
import lose from "../../assets/audio/lose.mp3";
import win from "../../assets/audio/win.mp3";
import vs from "../../assets/img/vs.png";
import rewardChest from "../../assets/img/reward_box.png";
import shield from "../../assets/img/star_protection.png";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import Console from "../../components/Console/Console";
import { motion, useMotionValue } from "framer-motion";
import { socket } from "../../socket";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import questions from "../../questions.json";
import axios from "axios";

export default function PVP() {
  const [sett, showSettings] = useState(false);
  const [surrender, showSurrender] = useState(false);
  const [confirm, showconfirm] = useState(false);
  const [playlosersound, setPlayLoserSound] = useState(false);
  const [input, setInput] = useState("");
  const [rcount, setrCount] = useState(1);
  const [victory, showVictory] = useState(false);
  const [reward, showReward] = useState(false);
  const [starProtection, showStarProtection] = useState(false);
  const [starPage, showStarPage] = useState(false);
  const [correct, showCorrect] = useState(false);
  const [correctStatus, setCorrectStatus] = useState(false);
  const navigate = useNavigate();
  const account = useConfigStore((state) => state.account);
  const setAccount = useConfigStore((state) => state.setAccount);
  const [disableBtn, setDisabledBtn] = useState(false);

  const [hprval, setHprval] = useState(100);
  const [hplval, setHplval] = useState(100);
  const linkRef = useRef();
  const stars = account.stars - 1;
  const username = account.username;

  // generate a random number for question and answer
  // const rand = Math.floor(Math.random() * questions.length);
  const [qnum, setQnum] = useState(0);
  const location = useLocation();
  const userId = location.state;
  const room_id = useParams(":matchid").matchid;
  useEffect(() => {
    socket.on("match_result", async (data) => {
      if (data.msg === "You won!") {
        const data = {
          username,
          stars,
          didWin: true,
        };
        showVictory(true);
        const res = await axios.put(
          `${import.meta.env.VITE_URL_PREFIX}:3003/api/accounts/star`,
          data
        );
        window.localStorage.setItem(
          "loggedUser",
          JSON.stringify(res.data.account)
        );

        setAccount(
          res.data.account.username,
          res.data.account.email,
          res.data.account.stars
        );
      }
    });

    socket.on("match_end", async (data) => {
      if (data.loser === socket.id) {
        const data = {
          username,
          stars,
          didWin: false,
        };
        const res = await axios.put(
          `${import.meta.env.VITE_URL_PREFIX}:3003/api/accounts/star`,
          data
        );
        window.localStorage.setItem(
          "loggedUser",
          JSON.stringify(res.data.account)
        );

        setAccount(
          res.data.account.username,
          res.data.account.email,
          res.data.account.stars
        );

        console.log({ stars });
        setTimeout(() => {
          toggleLose();
        }, 2500);
      } else {
        const data = {
          username,
          stars,
          didWin: true,
        };
        const res = await axios.put(
          `${import.meta.env.VITE_URL_PREFIX}:3003/api/accounts/star`,
          data
        );
        window.localStorage.setItem(
          "loggedUser",
          JSON.stringify(res.data.account)
        );

        setAccount(
          res.data.account.username,
          res.data.account.email,
          res.data.account.stars
        );

        console.log({ stars });

        setTimeout(() => {
          showVictory(true);
        }, 2500);
      }
    });

    socket.on("disconnect", () => {
      navigate("/home");
    });
  }, []);

  useEffect(() => {
    socket.on("player_code_submit", (res) => {
      if (res.correct && socket.id === res.socketId) {
        setHprval(hprval - 25);
        setrCount(rcount + 1);
        setQnum(res.question_index);
        console.log(hprval, qnum);
        showCorrect(!correct);
      } else if (res.correct && socket.id !== res.socketId) {
        setrCount(rcount + 1);
        setHplval(hplval - 25);
        setQnum(res.question_index);
        console.log(hplval, qnum);
      }
      // For submit button
      setDisabledBtn(true);
    });

    if (hplval <= 0) {
      socket.emit("player_lose", { room_id, socketId: socket.id });
    }
  }, [hprval, hplval]);

  // display the settings UI
  const toggleSettings = () => {
    showSettings(!sett);
  };

  // display the surrender UI
  const toggleSurrender = () => {
    showSurrender(!surrender);
  };

  //Triggers when user clicks the confirm or check button
  const toggleConfirm = async () => {
    const data = {
      username,
      stars,
      didWin: false,
    };

    // console.log({ stars });
    // const res = await axios.put(
    //   `${import.meta.env.VITE_URL_PREFIX}:3003/api/accounts/star`,
    //   data
    // );
    // window.localStorage.setItem("loggedUser", JSON.stringify(res.data.account));

    // setAccount(
    //   res.data.account.username,
    //   res.data.account.email,
    //   res.data.account.stars
    // );

    showconfirm(!confirm);
    showSurrender(surrender);
    setPlayLoserSound(true);
    console.log({ room_id });
    socket.emit("surrender", { roomId: room_id, userId });
    setTimeout(() => {
      setPlaySound(false);
    }, 3000);
  };

  const toggleLose = () => {
    showconfirm(!confirm);
    setPlayLoserSound(true);
    setTimeout(() => {
      setPlaySound(false);
    }, 3000);
  };

  const toggleStarPage = () => {
    showStarPage(!starPage);
  };

  const toggleReward = () => {
    showReward(!reward);
    showStarPage(false);
    showVictory(false);
    showconfirm(false);
    showStarProtection(false);
  };

  const toggleStarProtection = () => {
    showStarProtection(!starProtection);
    showStarPage(false);
    showVictory(false);
    showconfirm(false);
    showReward(false);
    showSurrender(false);
  };

  // get the value inputted by user
  const handleInputChange = (value) => {
    setInput(value);
  };

  // for reset button to clear the text
  const handleReset = () => {
    console.log("clear");
    setInput("");
    console.log(input);
  };

  // get the input then evaluate then display in the output container
  const handleClick = () => {
    setDisabledBtn(false);
    setCorrectStatus(!correctStatus);
    const code = input;
    const playerDetails = {
      userId,
    };
    socket.emit("match_submit", {
      room_id,
      code,
      socketId: socket.id,
      questionDetails: questions[qnum],
    });
  };

  return (
    <>
      <div className={`settings-pvp  ${sett ? "on" : "off"}`}>
        <Settings isTransparent={true} />
      </div>
      {/* <div className="pvpmatchfound">
        <div className="yourchar">
          <h2>Dazai</h2>
          <div className="charImg1">
            <img src={charMan} />
          </div>
        </div>
        <div className="vs">
          <p>VS</p>
        </div>
        <div className="opponentchar">
          <h2>Test123</h2>
          <div className="charImg2">
            <img src={charWoman} />
          </div>
        </div>
      </div> */}
      <div className="container container-pvp">
        <img src={bg} alt="bg" className="pvp-bg" />
        <div className="pvp-container">
          <div className="pvp-container-content">
            <div className="pvp-container-left">
              <div className="pvp-left-content">
                <div className="question">
                  <p>
                    <strong>Q:</strong> {questions[qnum].question}
                  </p>
                </div>
              </div>
            </div>
            <div className="pvp-container-right">
              <div className="pvptop">
                <div className="pvptop-left">
                  <div className="hpbar">
                    <motion.div
                      initial={{
                        width: "100%",
                        height: "2.5em",
                        background:
                          "linear-gradient(180deg, rgba(207, 34, 34, 0.95) 62.87%, #831616 71.55%)",
                        borderRadius: "6px",
                      }}
                      animate={{
                        width: `${hplval}%`,
                        height: "2.5em",
                        background:
                          "linear-gradient(180deg, rgba(207, 34, 34, 0.95) 62.87%, #831616 71.55%)",
                        borderRadius: "6px",
                      }}
                      transition={{ duration: 2 }}
                    ></motion.div>
                  </div>
                  <div className="username username1">
                    <h4>{username}</h4>
                  </div>
                  <div className="firstchar">
                    <img src={charMan} alt="" />
                  </div>
                </div>
                <div className="pvptop-center">
                  <div className="clock">
                    <img src={vs} />
                  </div>
                  <div className="round">
                    <h2>Round {rcount}</h2>
                  </div>
                </div>
                <div className="pvptop-right">
                  <div className="hpbar">
                    <motion.div
                      initial={{
                        width: "100%",
                        height: "2.5em",
                        marginLeft: "auto",
                        background:
                          "linear-gradient(180deg, rgba(207, 34, 34, 0.95) 62.87%, #831616 71.55%)",
                        borderRadius: "6px",
                      }}
                      animate={{
                        width: `${hprval}%`,
                        height: "2.5em",
                        background:
                          "linear-gradient(180deg, rgba(207, 34, 34, 0.95) 62.87%, #831616 71.55%)",
                        borderRadius: "6px",
                      }}
                      transition={{ duration: 2 }}
                    ></motion.div>
                  </div>
                  <div className="username username2">
                    <h4>Test</h4>
                  </div>
                  <div className="secondchar">
                    <img src={charWoman} alt="" />
                  </div>
                </div>
                <div className="settings">
                  <img
                    src={!sett ? setting : xbtn}
                    alt=""
                    onClick={toggleSettings}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pvpbottom">
            <div className="bottom-left">
              <div className="userinput">
                <CodeMirror
                  value={questions[qnum].template}
                  onChange={handleInputChange}
                  height="190px"
                  className="codemirror"
                  // extensions={[javascript({ jsx: true })]}
                  extensions={[python()]}
                  options={{
                    theme: "dark-one",
                    lineNumbers: true,
                    scrollbarStyle: null,
                    lineWrapping: true,
                  }}
                />
                <div className="buttons">
                  <div
                    className="btn submitbtn"
                    onClick={handleClick}
                    disabled={disableBtn ? true : false}
                  >
                    SUBMIT
                  </div>
                  {/* <div className="btn clearbtn" onClick={handleReset}>
                    CLEAR
                  </div> */}
                </div>
              </div>
            </div>
            <div className="bottom-right">
              <div className="outputs">
                <div className="display-output">
                  <div className="test-case">
                    <h3>TEST CASES:</h3>
                    <p>Case 1: {questions[qnum].testCases[0].exe}</p>
                    <p>Case 2: {questions[qnum].testCases[1].exe}</p>
                    <p>Case 3: {questions[qnum].testCases[2].exe}</p>
                  </div>
                  <div className="output-test">
                    <h3>OUTPUT:</h3>
                    <p>{questions[qnum].testCases[0].answer}</p>
                    <p>{questions[qnum].testCases[1].answer}</p>
                    <p>{questions[qnum].testCases[2].answer}</p>
                  </div>
                </div>
              </div>

              <div className="btn btn-exit" onClick={toggleSurrender}>
                GIVE UP
              </div>
            </div>
          </div>
        </div>
        {surrender && (
          <div className="surrender">
            <div className="surrender-container">
              <div className="surrender-top">
                <h1>Surrender</h1>
                <h1>
                  <span>Game</span>
                </h1>
              </div>
              <div className="surrender-content">
                <h2>Do you want to surrender?</h2>
                <div className="surr-star">
                  <h2>You will lose a</h2>
                  <span className="star">&#9733;</span>
                </div>
                <div className="surr-buttons">
                  <div
                    className="btn confirmbtn"
                    onClick={() => {
                      toggleConfirm();
                      toggleSurrender();
                    }}
                  >
                    <FaCheck className="check" />
                  </div>
                  <div className="btn" onClick={toggleSurrender}>
                    <span>X</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {confirm && (
          <div className="lose" onClick={toggleStarPage}>
            <div
              className="lose-container"
              style={{ display: starPage ? "none" : "" }}
            >
              <h1>DEFEAT</h1>
              <p>Click anywhere to continue...</p>
            </div>
          </div>
        )}

        {victory && (
          <div className="win" onClick={toggleStarPage}>
            <div
              className="lose-container"
              style={{ display: starPage ? "none" : "" }}
            >
              <h1>VICTORY</h1>
              <p>Click anywhere to continue...</p>
            </div>
          </div>
        )}

        {starPage && (
          <div
            className="starpage"
            onClick={victory ? toggleReward : toggleStarProtection}
          >
            <div className="starpage-content">
              <div className="starpage-star">
                <div className={`${victory ? "stargain" : "starfall"}`}>
                  <h2>&#9733;</h2>
                </div>
                <h2>&#9733;</h2>
              </div>
              <div className="starcount">
                <h2 className="currentstar">{stars}</h2>
                <h2 className="updatedstar">
                  {victory ? stars + 1 : stars - 1}{" "}
                </h2>
                <div
                  className="addorminus"
                  style={{ color: victory ? "yellow" : "red" }}
                >
                  <h2>{victory ? "+1" : "-1"}</h2>
                </div>
              </div>
            </div>
            <p>Click anywhere to continue...</p>
          </div>
        )}

        {reward && (
          <Link to="/" ref={linkRef}>
            <div className="reward">
              <div className="reward-content">
                <h2>PVP REWARD</h2>
                <div className="rewardChest">
                  <img src={rewardChest} />
                </div>
                <h3>300 Gold</h3>
                <p>Click anywhere to continue...</p>
              </div>
            </div>
          </Link>
        )}

        {starProtection && (
          <Link to="/" ref={linkRef}>
            <div className="star-protection">
              <div className="star-protection-content">
                <h2>STAR PROTECTION</h2>
                <div className="shield">
                  <img src={shield} />
                </div>
                <h4>You will not lose a star this time.</h4>
                <p>Click anywhere to continue...</p>
              </div>
            </div>
          </Link>
        )}

        {playlosersound && (
          <div>
            <audio autoPlay src={lose} type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {victory && (
          <div>
            <audio autoPlay src={win} type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </>
  );
}
