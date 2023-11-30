import React, { useEffect, useRef } from "react";
import backgroundMusic from "../../assets/audio/music.mp3";

export default function AudioPlayer({ isPlaying }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div>
      <div>
        <audio ref={audioRef} loop src={backgroundMusic} type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
