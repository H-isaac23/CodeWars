
import "./MatchHistory.css";
import victory from "../../assets/img/victory.png";
import defeat from "../../assets/img/defeat.png";
import vs from "../../assets/img/vs.png";
import cwicon from "../../assets/img/cwicon.png";
import { socket } from "../../socket";
import useConfigStore from "../../store/configStore";


export default function MatchHistory ({showMatchHistory}) {
    const account = useConfigStore((state) => state.account);

    return(
        <div className="history-container">
            <div className="history-close-button" onClick={()=>showMatchHistory(false)}>
                <div>X</div>
            </div>
            <div className="history-content">
                <div className="history-title">
                    <h1>MATCH</h1>
                    <h1>
                        <span>HISTORY</span>
                    </h1>
                </div>
                <div className="history-box">
                    <div className="history-status">
                        <div className="history-victory">
                            <img src={victory}/>    
                        </div>
                        <div className="history-result">
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>{account.username}</p>
                            </div>
                            <div className="history-vs">
                                <img src={vs}/>
                            </div>
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>Kaito</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-status">
                        <div className="history-victory">
                            <img src={victory}/>    
                        </div>
                        <div className="history-result">
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>{account.username}</p>
                            </div>
                            <div className="history-vs">
                                <img src={vs}/>
                            </div>
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>Kaito</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-status">
                        <div className="history-victory">
                            <img src={victory}/>    
                        </div>
                        <div className="history-result">
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>{account.username}</p>
                            </div>
                            <div className="history-vs">
                                <img src={vs}/>
                            </div>
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>Kaito</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-status">
                        <div className="history-victory">
                            <img src={victory}/>    
                        </div>
                        <div className="history-result">
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>{account.username}</p>
                            </div>
                            <div className="history-vs">
                                <img src={vs}/>
                            </div>
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>Kaito</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-status">
                        <div className="history-victory">
                            <img src={victory}/>    
                        </div>
                        <div className="history-result">
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>{account.username}</p>
                            </div>
                            <div className="history-vs">
                                <img src={vs}/>
                            </div>
                            <div className="player-history">
                                <img src={cwicon}/>
                                <p>Kaito</p>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    );
}