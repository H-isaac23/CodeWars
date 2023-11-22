import React, {useState, useRef} from "react"
import "../AudioButton/AudioButton.css"
import useConfigStore from "../../store/configStore"

export default function AudioButton () {
    const isPlaying = useConfigStore(state => state.isPlaying);
    console.log("hello: ", isPlaying);
    const togglePlaying = useConfigStore(state => state.togglePlaying)
    return(
        <button className={`toggle-button ${isPlaying ? 'onMusic' : 'offMusic'}`} onClick={togglePlaying}>
            <p>ON</p>
            <p>OFF</p>
            <div className="toggle-icon"></div>
        </button>
    )
}