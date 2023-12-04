import React from "react";
import { useState, useEffect } from "react";
import "./Login.css";
import bg from "../../assets/img/4455.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";

import useConfigStore from "../../store/configStore";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPolicy, setshowPolicy] = useState(false);
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");

  const showModalPolicy = () => setshowPolicy(!showPolicy);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const account = useConfigStore((state) => state.account);
  const setAccount = useConfigStore((state) => state.setAccount);

  useEffect(() => {
    const userLog = window.localStorage.getItem("loggedUser");
    console.log(userLog);
    if (userLog) {
      const {
        content: { username, email, stars },
      } = JSON.parse(userLog);
      setAccount(username, email, stars);
      navigate("/home");
    }
  }, []);

  const notify = (err) => toast(err);
  const dupeError = () => toast("Username/Email is already taken.");
  const passLen = () => toast("Password should be 8-16 characters.");
  const signSuccessful = () => toast("Your account has been created");

  const onClick = () => {
    setIsLogin(!isLogin);
    let email = document.getElementById("email");
    email.classList.toggle("hide-email");
    setPassword("");
    setEmail("");
    setUsername("");
  };

  const onLogin = async () => {
    if (isLogin) {
      const data = {
        username,
        password,
      };

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_URL_PREFIX}:3000/public/v1/login`,
          data
        );
        if (res.status === 200) {
          console.log(res);
          const {
            content: { username, email, stars },
          } = res.data;
          window.localStorage.setItem("loggedUser", JSON.stringify(res.data));
          setAccount(username, email, stars);
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
        notify(error.message);
      }
    }

    if (!isLogin) {
      if (password.length < 8 || password.length > 16) {
        passLen();
      } else {
        const data = {
          username,
          email,
          password,
        };

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_URL_PREFIX}:3000/public/v1/create/account`,
            data
          );
          if (res.status === 201) {
            signSuccessful();
            setIsLogin(!isLogin);
            let email = document.getElementById("email");
            email.classList.toggle("hide-email");
          }
          setUsername("");
          setPassword("");
          setEmail("");
        } catch (error) {
          dupeError();
        }
      }
    }
  };

  return (
    <div className="container">
      <img src={bg} alt="bg" />
      <div className="login-box">
        <h1>Code</h1>
        <h1>
          <span>Wars</span>
        </h1>
        <input
          type="text"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="EMAIL"
          id="email"
          value={email}
          className="hide-email show-email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="passfield">
          <input
            type={passwordType}
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="icon-toggle" onClick={togglePassword}>
            {passwordType === "password" ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        <button className="btn" id="signlog" onClick={onLogin}>
          {isLogin ? "LOGIN" : "SIGN UP"}
        </button>
        {isLogin && (
          <p>
            <Link to="/requestPassword">Forgot Password?</Link>
          </p>
        )}
        <div className="signlog">
          {!isLogin && (
            <div className="terms">
              <input type="checkbox" />
              <p>
                {" "}
                I agree to{" "}
                <a className="policy" onClick={showModalPolicy}>
                  Privacy Policy & Terms
                </a>{" "}
              </p>
            </div>
          )}
          <div id="signlog-text">
            {isLogin ? "Don't have account?" : "Already have account?"}
          </div>
          <button id="login" onClick={onClick}>
            {isLogin ? "SIGN UP" : "LOGIN"}
          </button>
        </div>
      </div>
      {showPolicy && (
        <div className="modalPolicy">
          <img src={bg} alt="bg" />
          <div className="modalPolicyContent">
            <h2>Terms and Condition</h2>
            <p>
              At our game website, we prioritize your privacy and are committed
              to safeguarding your personal information. When you visit or use
              our website, we may collect certain data to enhance your
              experience and provide better services. This may include
              information like your name, and email address which you may
              voluntarily provide to us. Additionally, we may automatically
              collect details about your device, such as your IP address,
              browser type, and operating system, to improve our services. Rest
              assured, we do not sell, rent, or disclose your personal
              information to any third parties unless required by law or with
              your explicit consent. We may use the collected information to
              improve our website, respond to your inquiries. By accessing and
              using our website, you agree to the terms outlined in this Privacy
              Policy.
            </p>
            <button className="btn" onClick={showModalPolicy}>
              Return
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
