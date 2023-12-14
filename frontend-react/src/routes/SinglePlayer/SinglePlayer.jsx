import React, { useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import data from "../../questions.json";
import easyQ from "../../25-medium-questions.json";
import mediumQ from "../../25-medium-questions.json";
import hardQ from "../../25-medium-questions.json";
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";


const Modal = ({text, onClick, visible, setVisible, end=false}) =>{
  let home = false, error = false, correct=false,newText= '';

  if(text.includes('Correct')){ 
    correct = true;
    newText = "Congratulations, You have gained a points for completing the code!."
  }else{
    error = true;
  }
  if(text.includes('Home')){
    home = true;
    error = false
    correct =false;
  }

  const Okay = () =>{
    return(
      <div className="w-[20em] h-[3em] bg-green-400 rounded-xl border-4 border-white flex justify-center items-center" onClick={()=> setVisible(false) } >
        <p className="text-2xl">OKAY</p>
      </div> 
    )
  }
  const HomeButton = ({name, color}) =>{
    return(
      <div className={`w-[10em] mt-2 border-4 h-[3em] flex justify-center items-center rounded-lg ${color}`} onClick={()=> setVisible(false) } style={{ opacity: error? 0:1 }} >
        <p className="text-2xl font-times">{name}</p>
      </div>
    )
  }
  return (
    <div className="absolute top-0 w-full h-full flex justify-center items-center backdrop-blur-lg z-100" style={{display: visible? "":"none" }}>
      <div className="w-1/4 h-1/4 rounded-lg bg-gradient-to-b from-active-gradient p-3 relative flex flex-col justify-evenly items-center shadow-xl">
          <div className="modal_text text-2xl font-times">
            <p >{correct? newText:text}</p>
          </div>
          <div className="" >
            <div className="flex justify-between items-center gap-2">
              { !correct && !end && <HomeButton name="No" color="bg-green-400"/>}
              { home && !correct && <Link to={'/'} > <HomeButton name="Yes" color="bg-[#DC4C3D]" /> </Link>}
            </div>
            { !home && !correct && !end && <Okay /> }
            { correct && <Okay /> }
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
  const Toast = (str) => toast(str);
  const queryParams = new URLSearchParams(location.search);
  const qType = queryParams.get('qType');
  useEffect(()=>{
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
  function submitCode(){
    if(isCodeCorrect){
      setText("Code Correct")
    }else{
      setText("Code Wrong!. You must complete the Code First")
    }
    setVisible(true)
  }
  function updateProblem(varCount){
    
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
        setCount(varCount)
        setQuestion(initialQ[count].question)
        setAwitTemplate(initialQ[count].template)
        setTemplate(initialQ[count].template)
        const testcases = initialQ[count].testCases;
        setInputs(testcases.map(item => item.exe.substring(item.exe.indexOf('(') + 1, item.exe.indexOf(')') + 1)));
        setOutputs(testcases.map(item => item.answer));
        setIsCodeCorrect(!isCodeCorrect)
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

  function checkCode(){
    axios.post('http://localhost:3003/single', {code :template})
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
              }else{
                Toast("Wrong Output")
              }
              setIsCodeCorrect(checkArrays)
              console.log(tempOutput, outputs)
            }
          })
          .catch(error=>{
            console.log(error)
          })
  }

  return (
     <div className="w-full   ">
      <div className="w-full h-full absolute top-0 left-0 z-0">
        <img
          src={imgBg}
          alt="Image background"
          className="w-full h-full object-cover"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        />
      </div>
    <div className="relative h-[100%] z-100 flex justify-evenly items-base p-2 ">
      <div className="w-[65%] h-[100%] ">
        <h1 className="font-times text-5xl">SOLUTION</h1>
        <div className="bg-inactive-color p-5 rounded-lg">
          <textarea
            className="bg-active-color w-full rounded-xl p-4 text-xl"
            spellCheck="false"
            name="code"
            cols="54"
            rows="14"
            value={template}
            onChange={(e)=> handleTemplate(e.target.value)}
          ></textarea>
        </div>
        <div className="w-full bg-half-color mt-3 h-[40%] p-4 rounded-2xl">
        <h3 className="font-times text-3xl">OUTPUT</h3>
          <div className="flex ">
            <div className=" h-[10em] w-[80%] bg-active-color rounded-2xl" style={{overflow:'auto'}}>
              <pre id="outputText">{userOutput}</pre>
            </div>
            <div className=" w-[20%] p-4 flex flex-col justify-between">
              <input className="w-full h-[3em] rounded-2xl border-4 border-white bg-green-400 shadow-lg" type="button" id="check" value="Check" onClick={checkCode} />
              <input className="w-full h-[3em] rounded-2xl border-4 border-white bg-[#DC4C3D] shadow-lg" type="button" id="submit" value="Submit" onClick={submitCode}  />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[30%]">
        <div className="">
          <div className="problem">
            <div className="problemContent">
              <h1 className="text-4xl font-times">{qType.toUpperCase()} {count}</h1>
            </div>

            <div className="content">
            <div className="bg-inactive-color mt-2 rounded-lg p-3 h-[13em]">
            <h3 className="text-2xl font-times">QUESTION</h3>
              <div className="bg-active-color h-[80%] rounded-lg p-2 text-xl font-times">
                <p id="questionProblem">
                  {question}
                </p>
              </div>  
            </div>

            <div className="bg-inactive-color mt-2 rounded-lg p-3 h-[13em]">
             <h3 className="text-2xl font-times">INPUTS</h3>
             <div className="bg-active-color h-[80%] rounded-lg p-2 text-xl font-times">
                <p>{inputs[0]}</p>
                <p>{inputs[1]}</p>
                <p>{inputs[2]}</p>
              </div>
             </div>

             <div className="bg-inactive-color mt-2 rounded-lg p-3 h-[13em]">
              <h3 className="text-2xl font-times">OUTPUT</h3>
              <div className="bg-active-color h-[80%] rounded-lg p-2 text-xl font-times">
                <p>{outputs[0]}</p>
                <p>{outputs[1]}</p>
                <p>{outputs[2]}</p>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 mt-2">
          <input type="button" id="next" className="h-[3em] w-[30%] rounded-2xl border-4 bg-green-400 shadow-lg" value="prev" onClick={()=> updateProblem(count-1)} />
          <input type="button" id="prev" className="h-[3em] w-[30%] rounded-2xl border-4 bg-green-400 shadow-lg" value="next" onClick={()=> updateProblem(count+1)} />
          <input type="button" id="home" className="h-[3em] w-[30%] rounded-2xl border-4 bg-[#DC4C3D] shadow-lg" value="home" onClick={goHome} />
        </div>
      </div>

      
    </div>
     <Modal setVisible={setVisible} text={text} visible={visible}/>
     <Modal setVisible={setVisible} text={text} end={true} visible={limit}  />
     <ToastContainer />
    </div>

  );
}
