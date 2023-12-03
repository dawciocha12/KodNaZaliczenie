import quiz_data from "./quiz_data/quiz_data.js";
let currentIntervalid = 0;
let currentInterValidTotal = 0;
const titleNode = document.querySelector("#quizTitle");
const questionNode = document.querySelector("#question");
const answer = document.querySelector("#answer");
const questionTimeNode = document.querySelector("#questionTime");
const totalTime = document.querySelector("#totalTime");
const backBtn = document.querySelector("#back");
const nextBtn = document.querySelector("#next");
const endBtn = document.querySelector("#end");
backBtn.disabled = true;
endBtn.hidden = true;
titleNode.innerHTML = quiz_data.title;
questionNode.innerHTML = '5';
function getcurrentIdx() {
    return parseInt(localStorage.getItem("currentQuestionIdx"));
}
class Questiondetails {
    set(t, a, i) {
        this.time = t;
        this.ans = a;
        this.index = i;
    }
    displayQuestion() {
        backBtn.disabled = (getcurrentIdx() == 0);
        nextBtn.disabled = (getcurrentIdx() == quiz_data.questions.length - 1);
        startCounter();
        if (localStorage.getItem("currAns" + getcurrentIdx()) == undefined) {
            document.getElementById("answer").value = "";
        }
        else
            document.getElementById("answer").value = String(localStorage.getItem("currAns" + getcurrentIdx()));
        questionNode.innerHTML = (getcurrentIdx() + 1) + ". " + quiz_data.questions[getcurrentIdx()].formula;
    }
}
localStorage.setItem("currentQuestionIdx", "0");
let question = new Questiondetails();
function getAnswer() {
    localStorage.setItem("currAns" + getcurrentIdx(), document.getElementById("answer").value);
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
function allAnswered() {
    let valid = true;
    for (let index = 0; index < quiz_data.questions.length; index++) {
        if (localStorage.getItem("currAns" + index) == "")
            valid = false;
    }
    ;
    return valid;
}
function startCounter() {
    questionTimeNode.innerHTML = String(quiz_data.questions[getcurrentIdx()].timespent);
    currentIntervalid = setInterval(() => {
        questionTimeNode.innerHTML = `${++(quiz_data.questions[getcurrentIdx()].timespent)}`;
    }, 1000);
}
function startTotalCounter() {
    let time = 0;
    currentInterValidTotal = setInterval(() => {
        totalTime.innerHTML = `${++time}`;
    }, 1000);
}
function stopCounter() {
    quiz_data.questions[getcurrentIdx()].timespent = parseInt(questionTimeNode.innerText);
    clearInterval(currentIntervalid);
}
answer === null || answer === void 0 ? void 0 : answer.addEventListener('input', (e => {
    getAnswer();
    endBtn.hidden = !allAnswered();
}));
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    stopCounter();
    localStorage.setItem("currentQuestionIdx", `${getcurrentIdx() + 1}`);
    question.displayQuestion();
});
backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    localStorage.setItem("currentQuestionIdx", `${getcurrentIdx() - 1}`);
    stopCounter();
    question.displayQuestion();
});
endBtn.addEventListener('click', (e) => {
    for (let index = 0; index < quiz_data.questions.length; index++) {
        localStorage.setItem("timeSpent" + index, String(quiz_data.questions[index].timespent));
    }
    localStorage.setItem("totalTime", totalTime.innerHTML);
    window.location.href = "submit.html";
});
endBtn.hidden = !allAnswered();
totalTime.innerHTML = '0';
questionTimeNode.innerHTML = '0';
question.displayQuestion();
startTotalCounter();
