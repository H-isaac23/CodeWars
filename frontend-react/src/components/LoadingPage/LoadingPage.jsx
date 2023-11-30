import React, { useState, useEffect } from 'react';
import './LoadingPage.css';
import bg from "../../assets/img/4455.jpg";
import charMan from "../../assets/img/final_male_anim_IDLE.gif";
import charWoman from "../../assets/img/final_female_anim_IDLE(fixed frames).gif";

export default function LoadingPage() {
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        if (loadingProgress < 30) {
          setLoadingProgress((prevProgress) => prevProgress + 30);
        } else if (loadingProgress >= 30 && loadingProgress < 50) {
          setLoadingProgress((prevProgress) => prevProgress + 10);
        } else if (loadingProgress >= 50 && loadingProgress < 100) {
          setLoadingProgress((prevProgress) => prevProgress + 50);
        }
      }, 500);
  
      return () => clearInterval(interval);
    }, [loadingProgress]);
  
  
    return (
      <div className="App">
        <img src={bg} alt="" />
        <div className='character-content'>
            <div className='game-title'>
              <p>CODE WARS</p>
            </div>
            <div className='charWoman'>
                <img src={charWoman}/>
            </div>
            <div className='charMan'>
                <img src={charMan}/>
            </div>
        </div>
        <div className="loading-bar">
          <div className="loading-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
        </div>
        <div className='loading-progress'>
              <p>{loadingProgress}%</p>
            </div>
      </div>
    );
};
