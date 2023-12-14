import React, {useState, useRef} from "react"
import "../SoundButton/SoundButton.css"
import useConfigStore from "../../store/configStore"

export default function AudioButton () {
    const isSoundPlaying = useConfigStore(state => state.isSoundPlaying);
    const toggleSoundPlaying = useConfigStore(state => state.toggleSoundPlaying);
    console.log(isSoundPlaying);
    return(
        <button className={`toggle-button-sound ${isSoundPlaying ? 'onSound' : 'offSound'}`} onClick={toggleSoundPlaying}>
            <p>ON</p>
            <p>OFF</p>
            <div className="toggle-icon"></div>
        </button>
    )
}