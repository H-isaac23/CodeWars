import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import imgBg from "../../assets/img/bg2.jpg";
import easyQ from "../../130-easy-questions.json";
import mediumQ from "../../60-medium-questions.json";
import hardQ from "../../25-hard-questions.json";
import "./Choose.css";
import Cookies from "js-cookie";

export default function Choose() {
  const [eCount, setECount] = useState([0, 0, 0]);
  const [cookieCount, setCookieCount] = useState([0, 0, 0]);

  function countCookieValues(cookie) {
    const instArr = cookie.split(",");
    let i = 0;
    instArr.map((itemArr) => {
      i++;
    });
    return i;
  }

  useEffect(() => {
    const easyCount = easyQ.length - 1;
    const mediumCount = mediumQ.length - 1;
    const hardCount = hardQ.length - 1;

    setECount([easyCount, mediumCount, hardCount]);

    let cookieEasy = 0;
    let cookieMedium = 0;
    let cookieHard = 0;

    const userLog = window.localStorage.getItem("loggedUser");
    const data = JSON.parse(userLog);
    const username = data.content.username;

    const easyUser = Cookies.get(`easyQ_${username}`);
    const mediumUser = Cookies.get(`mediumQ_${username}`);
    const hardUser = Cookies.get(`hardQ_${username}`);
    console.log({ easyUser, mediumUser, hardUser });
    if (!easyUser) {
      Cookies.set(`easyQ_${username}`, "0", { expires: 30 });
    } else {
      cookieEasy = countCookieValues(easyUser);
    }
    if (!mediumUser) {
      Cookies.set(`mediumQ_${username}`, "0", { expires: 30 });
    } else {
      cookieMedium = countCookieValues(mediumUser);
    }
    if (!hardUser) {
      Cookies.set(`hardQ_${username}`, "0", { expires: 30 });
    } else {
      cookieHard = countCookieValues(hardUser);
    }

    setCookieCount([cookieEasy, cookieMedium, cookieHard]);
  }, []);

  const Category = ({ name, count }) => {
    return (
      <div className="category">
        <Link to={`/single-player?qType=${name.toLowerCase()}`}>
          <div className="category-item">
            <p className="">{name}</p>
            <p className="">{cookieCount[count]}/{eCount[count]}</p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="">
        <img
          src={imgBg}
          alt="Image background"
          className=""
          style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
        />
      </div>
      <div className="content bg-active-gradient">
        <div className="title">
          <h2 className="">Question </h2>
          <h2 className="title-down">Category</h2>
        </div>
        <br />
        <br />
        <br />
        <Category name="Easy" count={0} />
        <Category name="Medium" count={1} />
        <Category name="Hard" count={2} />
      </div>
    </div>
  );
}
