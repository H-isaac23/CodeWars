import React, { useState } from "react";
import { FaRegStar, FaCheck } from "react-icons/fa";
import "./Surrender.css";

export default function Surrender({showSurrender, showConfirm}) {
    return(
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
                            showConfirm(true);
                        }}
                    >
                        <FaCheck className="check" />
                    </div>
                    <div className="btn" onClick={() => showSurrender(false)}>
                        <span>X</span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}