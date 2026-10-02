//clicked on a quiz, fetch the questions.
//idea is to have a showquestion function, the eventlistener is on all the buttons, have a for loop to give every button an eventlistener.
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

    buttons.forEach((button, index) => {
        button.textContent = currentQuestion.options[index];
       // console.log(button);
    });

};

//adds eventListeners

buttons.forEach((button,index) =>{
    button.addEventListener("click",() => {
        if(index ===questions[currentQuestionID].correct_option){//update this line
            score++
        }
        currentQuestionID++

        if(currentQuestionID<questions.length){
            showQuestion();
        }
        else{
           //send to result.html with information.. update later
           window.location.href = "result.html"
        }
    });
      
});


fetchQuestions();


