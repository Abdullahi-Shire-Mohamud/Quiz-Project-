//clicked on a quiz, fetch the questions.
//idea is to have a showquestion function, the eventlistener is on all the buttons, have a for loop to give every button an eventlistener.

const { json } = require("express");

//at the end of the game call showresult:
const idfromURL = new URLSearchParams(window.location.search).get("quizId");
let questions = [];
let currentQuestionID = 0;
let score = 0;

const question = document.querySelector("#question");
const buttons = document.querySelectorAll(".answer-button");



async function fetchQuestions(){
    try{
        const response = await fetch("/api/quizzes/questions/" + idfromURL);
    if(!response.ok){
        throw new Error("Failed to fetch questions");
    }
    questions = await response.json();
    showQuestion();
    }
    catch(error){
        console.error(error);
        question.textContent = "Failed to load quiz content, please try again";
    }
};
//shows questions
function showQuestion(){
    const currentQuestion = questions[currentQuestionID];
    question.textContent = currentQuestion.question_text;
    //console.log(currentQuestion);
    //get the texts for the options
    const text =[currentQuestion.option_a,currentQuestion.option_b,currentQuestion.option_c,currentQuestion.option_d]
    buttons.forEach((button, index) => {
        button.textContent = text[index];
       
    });
};

//adds eventListeners //also get the correct options
let correctOptionLetter = ["A","B","C","D"];

buttons.forEach((button,index)=>{
    button.addEventListener("click",async () => {
        const q = questions[currentQuestionID];
        if(correctOptionLetter[index] ===q.correct_option){//checks if the index is the same as the correct_option.
            score++
        }
        currentQuestionID++

        if(currentQuestionID<questions.length){
            showQuestion();
        }
        else{
            const response = await fetch("/api/attempts",{
                method: "POST",
                headers:{
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    quizId: Number(idfromURL),
                    score,
                    total: questions.length,
                    username: localStorage.getItem("username")
                })
            });
            const data = await response.json();
           //send to result.html with information.. update later either index or result.html
           if (data.success){
            window.location.href = 'result.html?id='+data.id;
           }
           else{
                question.textContent = "Could not save your attempt, please try again later"
           };
        }
    });
      
});


fetchQuestions();


