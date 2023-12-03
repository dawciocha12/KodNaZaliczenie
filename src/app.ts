import quiz_data from "./quiz_data/quiz_data.js";

let currentIntervalid:number = 0;
let currentInterValidTotal:number = 0;

const titleNode: HTMLHeadElement = document.querySelector("#quizTitle") as HTMLElement;
const questionNode: HTMLSpanElement = document.querySelector("#question") as HTMLSpanElement;
const answer: HTMLInputElement = document.querySelector("#answer") as HTMLInputElement;
const questionTimeNode: HTMLSpanElement = document.querySelector("#questionTime") as HTMLSpanElement;
const totalTime: HTMLSpanElement = document.querySelector("#totalTime") as HTMLSpanElement;
const backBtn: HTMLButtonElement = document.querySelector("#back") as HTMLButtonElement;
const nextBtn: HTMLButtonElement = document.querySelector("#next") as HTMLButtonElement;
const endBtn: HTMLButtonElement = document.querySelector("#end") as HTMLButtonElement;
backBtn.disabled=true;
endBtn.hidden = true;
titleNode.innerHTML = quiz_data.title;
questionNode.innerHTML = '5';
function getcurrentIdx():number{
    return parseInt(localStorage.getItem("currentQuestionIdx")!);
}
class Questiondetails{
    private time:number|undefined;
    private ans:number|undefined;
    private index:number|undefined;

    public set(t:number,a:number,i:number){
        this.time=t;
        this.ans=a;
        this.index=i;
    }
    

    displayQuestion():void{
        backBtn.disabled=(getcurrentIdx()==0);
        nextBtn.disabled=(getcurrentIdx()==quiz_data.questions.length-1);
        startCounter();
        if(localStorage.getItem("currAns"+getcurrentIdx())==undefined)
        {
            (document.getElementById("answer") as HTMLInputElement).value="";
        }else
        (document.getElementById("answer") as HTMLInputElement).value=String(localStorage.getItem("currAns"+getcurrentIdx()));
        questionNode.innerHTML =(getcurrentIdx()+1)+". "+ quiz_data.questions[getcurrentIdx()].formula;
    }
       

}
localStorage.setItem("currentQuestionIdx","0");
let question:Questiondetails=new Questiondetails();


function getAnswer():void{
localStorage.setItem("currAns"+getcurrentIdx(),(document.getElementById("answer") as HTMLInputElement).value);
}

// function displayQuestion():void{
//     backBtn.disabled=(getcurrentIdx()==0);
//     nextBtn.disabled=(getcurrentIdx()==quiz_data.questions.length-1);
//     startCounter();
//     if(localStorage.getItem("currAns"+getcurrentIdx())==undefined)
//     {
//         (document.getElementById("answer") as HTMLInputElement).value="";
//     }else
//     (document.getElementById("answer") as HTMLInputElement).value=String(localStorage.getItem("currAns"+getcurrentIdx()));
//     questionNode.innerHTML =(getcurrentIdx()+1)+". "+ quiz_data.questions[getcurrentIdx()].formula;
// }

function allAnswered():boolean{
    let valid=true;
    for (let index = 0; index < quiz_data.questions.length; index++) {        
        if(localStorage.getItem("currAns"+index)=="") valid=false;
    };
    return valid;
}

function startCounter():void{
    questionTimeNode.innerHTML=String(quiz_data.questions[getcurrentIdx()].timespent);
    currentIntervalid = setInterval(()=>{
        questionTimeNode.innerHTML = `${++(quiz_data.questions[getcurrentIdx()].timespent)}`
    },1000)    
}

function startTotalCounter():void{
    let time=0;
    currentInterValidTotal = setInterval(()=>{
        totalTime.innerHTML = `${++time}`;
    },1000
    )
}

function stopCounter():void{
    quiz_data.questions[getcurrentIdx()].timespent=parseInt(questionTimeNode.innerText);
    clearInterval(currentIntervalid);
}

answer?.addEventListener('input',(e=>{
    getAnswer();
    endBtn.hidden=!allAnswered();
}))


nextBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    e.preventDefault();
    stopCounter();
    localStorage.setItem("currentQuestionIdx",`${getcurrentIdx()+1}`);
    question.displayQuestion();
})

backBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    e.preventDefault();
    localStorage.setItem("currentQuestionIdx",`${getcurrentIdx()-1}`);
    stopCounter();
    question.displayQuestion();
})

endBtn.addEventListener('click',(e)=>{
    for (let index = 0; index < quiz_data.questions.length; index++) {        
        localStorage.setItem("timeSpent"+index,String(quiz_data.questions[index].timespent));
    }
    localStorage.setItem("totalTime",totalTime.innerHTML);
    window.location.href="submit.html";   
})

endBtn.hidden=!allAnswered();
totalTime.innerHTML='0';
questionTimeNode.innerHTML='0';
question.displayQuestion();
startTotalCounter();