import React from "react";
import bg from "../../assets/img/4455.jpg";
import { Link } from "react-router-dom";
import "./About.css";

export default function About ({showAbout}) {
 return(
    <div className="container about-container">
    <img src={bg} alt=""/>
    <div className="aboutUs-box">
        <h1>ABOUT</h1>
        <h1>
          <span>US</span>
        </h1>
        <h4><strong>WEB-BASED EDUCATION GAME FOR ENHANCED ENGAGEMENT AND LEARNING OF PYTHON PROGRAMMING LANGUAGE</strong></h4>
        <h5>Web-based educational game for enhanced engagement and learning of Python programming language. It is designed primarily for those students who are new to the world of programming.</h5>
        <p>Bachelor of Science in Computer Science <br /> Block1, 3rd year</p>
        <div onClick={() => showAbout(false)}>
          <button className="btn" id="signlog">
            RETURN
          </button>
        </div>
    </div>
   </div>
 )
}