import React, { useState, useEffect} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import imgBg from "../../assets/img/bg2.jpg"
import easyQ from "../../60-medium-questions.json";
import mediumQ from "../../60-medium-questions.json";
import hardQ from "../../60-medium-questions.json";
import "./SinglePlayer.css"
// import data from "../../questions.json";
import axios from 'axios'
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";


const Modal = ({text, setVisible , visible}) =>{
const navigate = useNavigate()
console.log(visible)

function handleYes(){
  if(text.includes("Category")){
    navigate('/choose')
  }
  if(text.includes("Home")){
    navigate('/home')
  }
}

  return (
    <div className={`modal ${visible? '':'none'}`} >
        <div className="modal-container bg-active-gradient">
            <div className="modal-text" >
                <p>{text}</p>
            </div>
            <div className="modal-button">
                <button className="green btn-check" onClick={handleYes}>YES</button>
                <button className="red btn-check" onClick={()=> setVisible(false)}>NO</button>
            </div>
        </div>
    </div>
  )
}



export default function SinglePlayer() {
  const [ countQuestion, setCountQuestion ] = useState()
  const [ isCodeCorrect, setIsCodeCorrect ] = useState(false)
  const [ count , setCount ] = useState(1)
  const [ initialQ , setQ] = useState([])
  const [ question, setQuestion ] = useState('')
  const [ template , setTemplate ] = useState('')
  const [ awitTemplate , setAwitTemplate ] = useState('')
  const [ inputs, setInputs ] = useState([])
  const [ outputs, setOutputs ] = useState([])
  const [ userOutput , setUserOutput ] = useState('')
  const [ visible , setVisible] = useState(false)
  const [ text, setText ] = useState('')
  const [ limit, setlimit ] = useState(false)
  const [ cookieUser , setCookieUser ] = useState([])
  
  const Toast = (str) => toast(str);
  
  const queryParams = new URLSearchParams(location.search);
  const qType = queryParams.get('qType');
  const ip = queryParams.get('ip');
  const userLog = window.localStorage.getItem("loggedUser");
  const data = JSON.parse(userLog);
  const username = data.content.username;
  useEffect(()=>{
    getCookies()
    initialQ.length = 0;
    let questionData ;
    if(qType=='easy'){
      questionData = easyQ
    }else if(qType=='medium'){
      questionData = mediumQ
    }else if(qType=='hard'){
      questionData = hardQ
    }
    let tempCount = 0
    questionData.map(item=>{
        initialQ.push(item)
        tempCount++ 
    })
    setCountQuestion(tempCount)
    updateProblem(count)
  },[qType])
  
  function goHome(){
    setVisible(true)
    setText('You Wanna Go Home?')
    console.log('You Wanna Go Home')
  }

  function goCategory(){
    setVisible(true)
    setText('Select New Category?')
    console.log('You Wanna Go Category')
  }

  function submitCode(){
    if(isCodeCorrect){
      setText("Code Correct")
    }else{
      setText("Code Wrong!. You must complete the Code First")
    }
    setVisible(true)
  }

  function updateProblem(varCount){
    setIsCodeCorrect(false)
    if(varCount>=countQuestion){
      if(varCount==countQuestion){
        Toast("Last Question")
        setCount(varCount)
      }else{
        Toast("Question limit reached")
      }
    }else{
      if(varCount<1){
        setCount(1)
      }else{
         let randNum;
         do {
          randNum = Math.floor(Math.random() * countQuestion-1) + 1;
        } while (cookieUser.includes(randNum));
        
        setCount(randNum)
        setQuestion(initialQ[count].question)
        setAwitTemplate(initialQ[count].template)
        setTemplate(initialQ[count].template)
        const testcases = initialQ[count].testCases;
        setInputs(testcases.map(item => item.exe.split("==")[1]));
        setOutputs(testcases.map(item => item.answer));
        setUserOutput("")
      }
    }
  }
  function handleTemplate(text){
    setTemplate(text)
     if(template.length == awitTemplate.length-1){
      setTemplate(awitTemplate)
    }
  }
  function checkOutput(array1, array2) {
    if (array1.length === array2.length) {
      for (let i = 0; i < array1.length; i++) {
        if (String(array1[i]) !== String(array2[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  function getCookies(){
    const instanceCookie = Cookies.get(`${qType}Q_${username}`)
    console.log(instanceCookie)
    const instArr = instanceCookie.split(',')
    cookieUser.length = 0
    instArr.map(itemArr=>{
      cookieUser.push(parseInt(itemArr))
    })
    console.log(cookieUser)

  }
  function setCookie(){
    Cookies.remove(`${qType}Q_${username}`)
    Cookies.set(`${qType}Q_${username}`, cookieUser, { expires: 30})
  }
  function cleanCookie(){
    let uniqueValues = cookieUser.filter((value, index, self) => {
      return self.findIndex(item => typeof item === 'number' && typeof value === 'number' && item === value) === index;
    });
    cookieUser.length = 0
    uniqueValues.map(item =>{
      cookieUser.push(item)
    })
    setCookie()
    getCookies()

  }
  function checkCode(){
    let newTemplate = template+ `\r\nprint(${inputs[0]})`+ `\r\nprint(${inputs[1]})`+ `\r\nprint(${inputs[2]})`
    axios.post(`http://localhost:3003/single`, {code :newTemplate})
          .then(response=>{
            const message = response.data.message
            const status = response.data.status
            if(status===0){
              Toast("Code Error")
            }else{
             setUserOutput(message) 
             
             let tempOutput = message.split(/\r?\n/)
             if(tempOutput.length>2){
                tempOutput.pop()
             }
              const checkArrays = checkOutput(outputs, tempOutput)
              if(checkArrays){
                Toast("Correct Output")
                // Cookies.remove(`${qType}_${username}`)
                cookieUser.push(count)
                cleanCookie()
                console.log(cookieUser)
              }else{
                Toast("Wrong Output")
              }
              setIsCodeCorrect(checkArrays)
              // console.log(tempOutput, outputs)
            }
          })
          .catch(error=>{
            console.log(error)
          })
  }

  return (
    <>
    <div className="bg-image">
        <img
          src={imgBg}
          alt="Image background"
          className=""
          style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        />
    </div>
    <div className=" fullpane">
      <div className="left-pane">
        <h1 className="">SOLUTION</h1>
        <div className="code bg-inactive-color">
          <textarea
            className="bg-active-color overflow"
            spellCheck="false"
            name="code"
            cols="54"
            rows="14"
            value={template}
            onChange={(e)=> handleTemplate(e.target.value)}
          ></textarea>
        </div>
        <div className="">
          <h1 className="">OUTPUT</h1>
          <div className="output-container bg-active-color">
            <div className="output bg-half-color overflow" >
              <pre id="outputText" style={{fontSize:'1.5em'}}>{userOutput}</pre>
            </div>
            <div className="output-btn ">
              <input className="btn-check green" type="button" id="check" value="Check" onClick={checkCode} />
              <input style={{visibility: isCodeCorrect? '':'hidden'}} className="btn-check red" type="button" id="submit" value="Submit" onClick={submitCode}  />
            </div>
          </div>
        </div>
      </div>
      <div className="right-pane">
        <div className="">
          <br />
            <h3 className="">QUESTION</h3>
          <div className="entry-pane bg-inactive-color">
            <div className="pane bg-active-color">
              <p id="questionProblem">{question}</p>
            </div>  
          </div>

            <h3 className="">INPUTS</h3>
          <div className="entry-pane bg-inactive-color">
            <div className="pane bg-active-color">
              <p>{inputs[0]}</p>
              <p>{inputs[1]}</p>
              <p>{inputs[2]}</p>
            </div>
          </div>

            <h3 className="">OUTPUT</h3>
          <div className="entry-pane bg-inactive-color">
            <div className="pane bg-active-color">
              <p>{outputs[0]}</p>
              <p>{outputs[1]}</p>
              <p>{outputs[2]}</p>
            </div>
          </div>
        </div>
        <div className="btn-control">
          <input type="button" id="next" className="btn-check green" value="Random" onClick={()=> updateProblem(count-1)} />
          <input type="button" id="prev" className="btn-check green" value="Category" onClick={goCategory} />
          <input type="button" id="home" className="btn-check red" value="Home" onClick={goHome} />
        </div>
      </div>

    </div>
      <Modal setVisible={setVisible} text={text} visible={visible}/> 
      <ToastContainer />
    </>
  );
}