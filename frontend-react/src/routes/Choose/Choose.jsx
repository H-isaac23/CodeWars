import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import imgBg from "../../assets/img/bg.png"
import easyQ from "../../25-medium-questions.json";
import mediumQ from "../../25-medium-questions.json";
import hardQ from "../../25-medium-questions.json";
import "../../../output.css"
export default function Choose() {
  const [eCount, setECount] = useState([0, 0, 0]);
  const [cookieCount, setCookieCount] = useState([0, 0, 0]);

  useEffect(() => {
    const easyCount = easyQ.length;
    const mediumCount = mediumQ.length;
    const hardCount = hardQ.length;

    setECount([easyCount, mediumCount, hardCount]);

    const cookieEasy =  0;
    const cookieMedium =  0;
    const cookieHard = 0;
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
    <div className="relative z-100 w-1/4 h-72 px-5 shadow-2xl bg-gradient-to-b from-custom-gradient rounded-md">
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
