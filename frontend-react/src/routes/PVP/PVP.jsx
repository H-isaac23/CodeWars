import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import useConfigStore from "../../store/configStore";
import AudioButton from "../../components/AudioButton/AudioButton";
import Settings from "../../components/Settings/Settings";
import "./PVP.css";

import bg from "../../assets/img/4455.jpg";
import bg2 from "../../assets/img/bg3.jpg";
import bg_bottom from "../../assets/img/bg-brown.jpg";

import doubleDamage from "../../assets/img/double_damage_transparent.gif";
import heal from "../../assets/img/heal_transparent.gif";
import shield1 from "../../assets/img/shield_transparent.gif";

import charMan from "../../assets/img/final_male_anim_IDLE.gif";
import charMan2 from "../../assets/img/anim_male_2_idle.gif"
import charWoman from "../../assets/img/final_female_anim_IDLE(fixed frames).gif"
import malePunch from "../../assets/img/anim_male_2_punch.gif"
import maleKick from "../..//assets/img/final_male_anim_KICK.gif";

import setting from "../../assets/img/settingbtn.png";
import xbtn from "../../assets/img/x.png";
import vs from "../../assets/img/vs.png";
import clock from "../../assets/img/clock.png";
import swordCross from "../../assets/img/sword_cross.png";
import shield_icon from "../../assets/img/protection.png";
import sword_icon from "../../assets/img/sword.png";
import heal_icon from "../../assets/img/heal.png";

import lose from "../../assets/audio/lose.mp3";
import win from "../../assets/audio/win.mp3";
import kick from "../../assets/audio/kick.mp3";
import shieldSound from "../../assets/audio/shield.mp3";
import healSound from "../../assets/audio/heal.mp3";
import damageSound from "../../assets/audio/sword.mp3";
import fight from "../../assets/audio/fight.mp3"

import rewardChest from "../../assets/img/reward_box.png";
import shield from "../../assets/img/star_protection.png";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import Console from "../../components/Console/Console";
import { motion, useMotionValue } from "framer-motion";
import { socket } from "../../socket";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import questions from "../../25-medium-questions.json";
import axios from "axios";
import Surrender from "../../components/PVPComponents/Surrender/Surrender";

export default function PVP() {
  const navigate = useNavigate();
  const optionCharacter = useConfigStore((state) => state.optionCharacter);
  const [sett, setShowSettings] = useState(false);
  const [surrender, showSurrender] = useState(false);
  const [confirm, showConfirm] = useState(false);
  const [input, setInput] = useState("");
  const [rcount, setrCount] = useState(1);
  const [victory, showVictory] = useState(false);
  const [reward, showReward] = useState(false);
  const [starProtection, showStarProtection] = useState(false);
  const [starPage, showStarPage] = useState(false);
  const [correct, showCorrect] = useState(false);
  const [correctStatus, setCorrectStatus] = useState(false);
  const account = useConfigStore((state) => state.account);
  const setAccount = useConfigStore((state) => state.setAccount);
  const [disableBtn, setDisabledBtn] = useState(false);

  const [clickSubmit, userClickSubmit] = useState(false);
  const [clickOpponentSubmit, opponentClickSubmit] = useState(false);

  const [playlosersound, setPlayLoserSound] = useState(false);
  const [kickSound, setKickSound] = useState(false);
  const [protectionSound, setProtectionSound] = useState(false);
  const [regenSound, setRegenSound] = useState(false);
  const [doubleDamageSound, setDoubleDamageSound] = useState(false);

  const [healEffect, showHealEffect] = useState(false);
  const [damageEffect, showDamageEffect] = useState(false);
  const [reflectEffect, showReflectEffect] = useState(false);

  const [reflectEffectIcon, showReflectEffectIcon] = useState(false);
  const [damageEffectIcon, showDamageEffectIcon] = useState(false);
  const [healEffectIcon, showHealEffectIcon] = useState(false);

  const [healBuffClicked, setHealBuffClicked] = useState(false);
  const [damageBuffClicked, setDamageBuffClicked] = useState(false);
  const [reflectBuffClicked, setReflectBuffClicked] = useState(false);

  const [countHealUsed, setCountHealUsed] = useState(0);
  const [countDamageUsed, setCountDamageUsed] = useState(0);
  const [countReflectUsed, setCountReflectUsed] = useState(0);

  const [charAttack, setcharAttack] = useState(false);
  const [opponentAttack, setOpponentAttack] = useState(false);

  const backgroundImages = [bg, bg2];
  const [backgroundIndex, setBackgroundIndex] = useState(
    Math.floor(Math.random() * backgroundImages.length)
  );

  const [hprval, setHprval] = useState(100);
  const [hplval, setHplval] = useState(100);
  const linkRef = useRef();
  const stars = account.stars - 1;
  const username = account.username;

  // generate a random number for question and answer
  // const rand = Math.floor(Math.random() * questions.length);
  const [qnum, setQnum] = useState(0);
  const location = useLocation();
  const userId = location.state.id;
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
      console.log(data.loser);
      console.log(socket.id);
      if (data.loser === socket.id) {
        const data = {
          username,
          stars,
          hasStarProtection: false,
          didWin: false,
        };
        const res = await axios.put(
          `${import.meta.env.VITE_URL_PREFIX}:3000/public/v1/update/star`,
          data
        );
        window.localStorage.setItem(
          "loggedUser",
          JSON.stringify({ content: res.data.content })
        );

        console.log(res);

        setAccount(
          res.data.content.username,
          res.data.content.email,
          res.data.content.stars
        );

        console.log({ stars });
        setTimeout(() => {
          toggleLose();
        }, 2500);
      } else {
        const data = {
          username,
          stars,
          hasStarProtection: false,
          didWin: true,
        };
        const res = await axios.put(
          `${import.meta.env.VITE_URL_PREFIX}:3000/public/v1/update/star`,
          data
        );
        window.localStorage.setItem(
          "loggedUser",
          JSON.stringify({ content: res.data.content })
        );

        setAccount(
          res.data.content.username,
          res.data.content.email,
          res.data.content.stars,
          res.data.content.gold
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
      // what the heck
      if (socket.id === res.socketId) {
        opponentClickSubmit(false);
        userClickSubmit(true);
        setTimeout(() => {
          userClickSubmit(false);
        }, 480);
      } else {
        userClickSubmit(false);
        opponentClickSubmit(true);
        setTimeout(() => {
          opponentClickSubmit(false);
        }, 480);
      }

      if (res.correct && socket.id === res.socketId) {
        setHprval(hprval - 25);
        
        setcharAttack(true);
        setKickSound(true);
        
        setTimeout(() => {
          setcharAttack(false);
          setKickSound(false);
        }, 480);

        showDamageEffectIcon(false);
        
        if (
          res.buffs.includes("heal") &&
          res.playerUsername === account.username
        ) {
          setHplval(100);
        }

        if (
          res.buffs.includes("damage") &&
          !(res.playerUsername === account.username)
        ) {
          setHprval(hprval - 50);
        }

        if (
          res.buffs.includes("reflect") &&
          !(res.playerUsername !== account.username)
        ) {
          setHprval(hprval + 25);
        }

        setrCount(rcount + 1);
        setQnum(res.questionIndex);
        console.log(hprval, qnum);
        showCorrect(!correct);
      } else if (res.correct && socket.id !== res.socketId) {
        setOpponentAttack(true)
        setKickSound(true);
        
        setTimeout(() => {
          setOpponentAttack(false);
          setKickSound(false);
        }, 480);

        setHplval(hplval - 25);
        if (
          res.buffs.includes("heal") &&
          !(res.playerUsername !== account.username)
        ) {
          setHprval(100);
        }
        if (
          res.buffs.includes("damage") &&
          !(res.playerUsername !== account.username)
        ) {
          setHplval(hplval - 50);
        }
        if (
          res.buffs.includes("reflect") &&
          !(res.playerUsername !== account.username)
        ) {
          setHplval(hplval + 25);
        }
        setrCount(rcount + 1);
        setQnum(res.questionIndex);
        console.log(hplval, qnum);
      }
      // For submit button
      setDisabledBtn(true);
    });

    if (hplval <= 0) {
      socket.emit("player_lose", { room_id, socketId: socket.id });
    }
  }, [hprval, hplval]);

  function extractExpr2(str) {
    const regex = /==\s*(.*?)(?=\s*\)$)/;
    const match = str.match(regex);
    return match ? match[1].trim() : null;
  }

  // display the settings UI
  const toggleSettings = () => {
    setShowSettings(!sett);
  };

  // display the surrender UI
  const toggleSurrender = () => {
    showSurrender(true);
  };

  //Triggers when user clicks the confirm or check button
  useEffect(() => {
    if (confirm) {
      const data = {
        username,
        stars,
        didWin: false,
      };

      setPlayLoserSound(true);
      console.log({ room_id });
      socket.emit("surrender", { roomId: room_id, userId });

      setTimeout(() => {
        setPlaySound(false);
      }, 3000);
    }
  }, [confirm]);

  const toggleLose = () => {
    showConfirm(!confirm);
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
    showConfirm(false);
    showReward(false);
    showSurrender(false);
  };

  const toggleHeal = () => {
    if (!healBuffClicked) {
      showHealEffect(true);
      setRegenSound(true);
      showHealEffectIcon(true);
      setCountHealUsed((c) => c + 1);
      setTimeout(() => {
        showHealEffect(false);
        showHealEffectIcon(false);
        setRegenSound(false);
      }, 3000);
      setHealBuffClicked(true);
    }
  };

  const toggleDamage = () => {
    if (!damageBuffClicked) {
      showDamageEffect(true);
      setDoubleDamageSound(true);
      showDamageEffectIcon(true);
      setCountDamageUsed((c) => c + 1);
      setTimeout(() => {
        showDamageEffect(false);
        setDoubleDamageSound(false);
      }, 3000);
      setDamageBuffClicked(true);
    }
  };

  const toggleReflect = () => {
    if (!reflectBuffClicked) {
      showReflectEffect(true);
      setProtectionSound(true);
      showReflectEffectIcon(true);
      setCountReflectUsed((c) => c + 1);
      setTimeout(() => {
        setProtectionSound(false);
        showReflectEffect(false);
      }, 3000);
      setReflectBuffClicked(true);
    }
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
    // setcharAttack(true);
    // setKickSound(true);
    setCorrectStatus(!correctStatus);
    const code = input;
    const playerDetails = {
      userId,
    };
    const buffs = [];
    if (countDamageUsed <= 1 && damageBuffClicked) {
      buffs.push("damage");
    }
    if (countReflectUsed <= 1 && reflectBuffClicked) {
      buffs.push("reflect");
    }
    if (countHealUsed <= 1 && healBuffClicked) {
      buffs.push("heal");
    }
    console.log({ buffs });
    socket.emit("match_submit", {
      username,
      roomId: room_id,
      code,
      socketId: socket.id,
      questionDetails: questions[qnum],
      buffs,
    });
  };

  return (
    <>
      {sett && <Settings showSettings={setShowSettings} />}
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
        <img
          src={backgroundImages[backgroundIndex]}
          alt=""
          className="pvp-bg"
        />
        {/* This one below is just my thing to solve the bg  */}
        {backgroundImages[backgroundIndex] == bg2 && (
          <div className="bg-bottom">
            <img src={bg_bottom} />
          </div>
        )}
        <div className="pvp-container">
          <div className="pvp-container-content">
            <div className="pvp-container-left">
              <div className="pvp-left-content">
                <div className="pvp-left-content">
                  <div className="question">
                    <p>
                      <strong>Q:</strong> {questions[qnum].question}
                    </p>
                  </div>
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
                  <div className="username1-buff-status">
                    {reflectEffectIcon && (
                      <div className="reflect-buff reflect-buff-icon">
                        <img src={shield_icon} />
                      </div>
                    )}
                    {damageEffectIcon && (
                      <div className="doubledmg-buff doubledmg-buff-icon">
                        <img src={sword_icon} />
                      </div>
                    )}
                    {healEffectIcon && (
                      <div className="heal-buff heal-buff-icon">
                        <img src={heal_icon} />
                      </div>
                    )}
                  </div>
                  <div className={`firstchar ${charAttack ? "attack" : ""}`}>
                    {/* <img src={optionCharacter ? maleKick : charMan} alt="" /> */}
                    {charAttack ? (
                      <img src={optionCharacter ? maleKick : malePunch} />
                    ) : (
                      <img src={optionCharacter ? charMan : charMan2} alt="" />
                    )}

                    {clickSubmit && (
                      <div className="attack-indicator">
                        <img src={swordCross} />
                      </div>
                    )}
                    {healEffect && (
                      <div className="heal-effect">
                        <img src={heal} />
                      </div>
                    )}
                    {damageEffect && (
                      <div className="damage-effect">
                        <img src={doubleDamage} />
                      </div>
                    )}
                    {reflectEffect && (
                      <div className="reflect-effect">
                        <img src={shield1} />
                      </div>
                    )}
                  </div>
                  <div className="buffs">
                    <div
                      className={`reflect-buff ${
                        reflectBuffClicked ? "buff-disabled" : ""
                      }`}
                      onClick={toggleReflect}
                    >
                      <img src={shield_icon} />
                    </div>
                    <div
                      className={`doubledmg-buff ${
                        damageBuffClicked ? "buff-disabled" : ""
                      }`}
                      onClick={toggleDamage}
                    >
                      <img src={sword_icon} />
                    </div>
                    <div
                      className={`heal-buff ${
                        healBuffClicked ? "buff-disabled" : ""
                      }`}
                      onClick={toggleHeal}
                    >
                      <img src={heal_icon} />
                    </div>
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
                  <div className="username2-buff-status">
                    {/* {reflectEffectIcon && (
                      <div className="reflect-buff reflect-buff-icon reflect-buff-icon-opponent">
                        <img src={shield_icon} />
                      </div>
                    )}
                    {damageEffectIcon && (
                      <div className="doubledmg-buff doubledmg-buff-icon doubledmg-buff-icon-opponent">
                        <img src={sword_icon} />
                      </div>
                    )}
                    {healEffectIcon && (
                      <div className="heal-buff heal-buff-icon heal-buff-icon-opponent">
                        <img src={heal_icon} />
                      </div>
                    )} */}
                  </div>
                  <div className={`secondchar ${opponentAttack ? "attack" : ""}`}>
                    {/* <img src={optionCharacter ? maleKick : charMan} alt="" /> */}
                    {opponentAttack ? (
                      <img src={malePunch} />
                    ) : (
                      <img src={charMan2} alt="" />
                    )}
                    {/* <img src={optionCharacter ? charMan : charMan2} alt="" /> */}

                    {clickOpponentSubmit && (
                      <div className="attack-indicator attack-indicator-opponent">
                        <img src={swordCross} />
                      </div>
                    )}
                    {/* {healEffect && (
                      <div className="heal-effect heal-effect-opponent">
                        <img src={heal} />
                      </div>
                    )}
                    {damageEffect && (
                      <div className="damage-effect damage-effect-opponent">
                        <img src={doubleDamage} />
                      </div>
                    )}
                    {reflectEffect && (
                      <div className="reflect-effect">
                        <img src={shield1} />
                      </div>
                    )} */}
                  </div>
                </div>
                <div className="settings-button">
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
                    <p>
                      Case 1: {extractExpr2(questions[qnum].testCases[0].exe)}
                    </p>
                    <p>
                      Case 2: {extractExpr2(questions[qnum].testCases[1].exe)}
                    </p>
                    <p>
                      Case 3: {extractExpr2(questions[qnum].testCases[2].exe)}
                    </p>
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
          <Surrender showSurrender={showSurrender} showConfirm={showConfirm} />
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

        {kickSound && (
          <div>
            <audio autoPlay src={kick} type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {regenSound && (
          <div>
            <audio autoPlay src={healSound} type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {protectionSound && (
          <div>
            <audio autoPlay src={shieldSound} type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {doubleDamageSound && (
          <div>
            <audio autoPlay src={damageSound} type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </>
  );
}
