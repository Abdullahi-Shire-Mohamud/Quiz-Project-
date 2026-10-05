//Here we have admin make quizzes by inputting info for fetch, all in one page no stepping or refreshing
const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#message")

submitButton.addEventListener("click", async() => {
    const quiztitle = document.querySelector("#quiz-title");
    const quizCategory = document.querySelector("#quiz-category");
    const quizdiff = document.querySelector("#quiz-difficulty");

    const questions = [];

    //block 1
    const questionblock = document.querySelectorAll(".question-block");//questiontext,qoptiona,qoptionb etc and qcorrectoption.
    questionblock.forEach(b =>{
        questions.push({
            question_text:b.querySelector(".questiontext").value.trim(),
            option_a:b.querySelector(".qoptiona").value.trim(),
            option_b:b.querySelector(".qoptionb").value.trim(),
            option_c:b.querySelector(".qoptionc").value.trim(),
            option_d:b.querySelector(".qoptiond").value.trim(),
            correct_option:b.querySelector(".qcorrectoption").value.trim(),//you want A,B,C or D
        });
    });
    //pre validate
    if(!quiztitle||!quizCategory||!quizdiff||questions.some(q => Object.values(q).some(v => v === ""))){
        console.log("Fill in every input");
        return message.textContent = "Fill in every input";
    }
   try {
        const response = await fetch("/api/quizzes", {
            method : "POST",
            headers: {"Content-Type": "application/json"},
            body : JSON.stringify({
                quiztitle,quizCategory,quizdiff,questions
            })
        });
        const data = await response.json();
        if(response.ok&& data.sucesss){
            window.location.href = "index.html";
        }
        else{
            message.textContent = "Could not create the quiz";
        }


   } catch (error) {
    console.log(error);
    message.textContent = "Could not connect to the server, please try again later"
   }
});







