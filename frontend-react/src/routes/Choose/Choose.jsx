import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import imgBg from "../../assets/img/bg.png"
import easyQ from "../../easy-questions.json";
import mediumQ from "../../medium-questions.json";
import hardQ from "../../hard_questions.json";
import "../../../output.css"
import Cookies from "js-cookie"
export default function Choose() {
  const [eCount, setECount] = useState([0, 0, 0]);
  const [cookieCount, setCookieCount] = useState([0, 0, 0]);
  function countCookieValues(cookie){
    const instArr = cookie.split(',')
    let i  = 0
    instArr.map(itemArr=>{
      i++
    })
    return i
  }
  useEffect(() => {
    const easyCount = easyQ.length-1;
    const mediumCount = mediumQ.length-1;
    const hardCount = hardQ.length-1;

    setECount([easyCount, mediumCount, hardCount]);

    let cookieEasy =  0;
    let cookieMedium =  0;
    let cookieHard = 0;

    const userLog = window.localStorage.getItem("loggedUser");
    const data = JSON.parse(userLog);
    const username = data.content.username;
    
    const easyUser = Cookies.get(`easyQ_${username}`)
    const mediumUser = Cookies.get(`mediumQ_${username}`)
    const hardUser = Cookies.get(`hardQ_${username}`)
    console.log({easyUser, mediumUser, hardUser})
    if(!easyUser){
      Cookies.set(`easyQ_${username}`,'0', { expires: 30})
    }else{
      cookieEasy = countCookieValues(easyUser)
    }
    if(!mediumUser){
      Cookies.set(`mediumQ_${username}`,'0', { expires: 30})
    }else{
      cookieMedium = countCookieValues(mediumUser)
    }
    if(!hardUser){
      Cookies.set(`hardQ_${username}`,'0', { expires: 30})
    }else{
      cookieHard = countCookieValues(hardUser)
    }

    setCookieCount([cookieEasy, cookieMedium, cookieHard]);

  }, []);


 const Category  = ({name , count}) =>{
  return (
    <div className="h-1/6 w-full my-4 relative border bg-[#3DDC7D] shadow-lg rounded-lg">
      <Link to={`/single-player?qType=${name.toLowerCase()}`}>
        <div className="flex justify-between items-center p-2">
          <p className="text-2xl font-times">{name}</p>
          <p className="text-2xl font-times">{cookieCount[count]}/{eCount[count]}</p>
        </div>
      </Link>
    </div>
  )
 }

 return (
  <div className="w-full h-full absolute z-10 flex justify-center items-center ">
    <div className="w-full h-full absolute top-0 left-0 z-0">
      <img
        src={imgBg}
        alt="Image background"
        className="w-full h-full object-cover"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      />
    </div>
    <div className="relative z-100 w-1/4 h-72 px-5 shadow-2xl bg-custom-gradient rounded-md">
      <div className="relative ">
        <h2 className="-mt-10 text-5xl font-times">Question </h2>
        <h2 className="absolute right-5 text-5xl font-times">Category</h2>
      </div>
      <br /><br />
      <Category name="Easy" count={0} />
      <Category name="Medium" count={1} />
      <Category name="Hard" count={2} />
    </div>
  </div>
);

}
