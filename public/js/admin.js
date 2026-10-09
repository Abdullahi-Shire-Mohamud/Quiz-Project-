//Here we have admin make and modify quizzes by inputting info for fetch, all in one page no stepping or refreshing
const quizId = new URLSearchParams(window.location.search).get("id");

const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#message")
//inputs are already shown for the put path
async function loadQuiz(quizId){
    try {
        const quizzesresult = await fetch("/api/quizzes");
        const questionresult = await fetch("/api/quizzes/questions/" + quizId);

        if(!questionresult.ok || !quizzesresult.ok){
            throw new Error("Could not load information from the quiz");
        }
        //load all the quizzes and find the one where it matches our id
        const quizzes = await quizzesresult.json();
        const quiz = quizzes.find(quiz=> quiz.id === Number(quizId));
        const questions = await questionresult.json();
        //no quiz
        if(!quiz){
            message.textContent = "Could not find quiz";
        }
        //update the basic information first
        document.querySelector("#quiz-title").value = quiz.title;
        document.querySelector("#quiz-category").value = quiz.category;
        document.querySelector("#quiz-difficulty").value = quiz.difficulty;

        //update question information(somewhat same as the read but flipped as there isnt a push anymore)
         const questionblock = document.querySelectorAll(".question-block");//questiontext,qoptiona,qoptionb etc and qcorrectoption.
    questionblock.forEach((b,i ) => {
         const question = questions[i];
         if(!question){
            //the question input is empty
            return;
         }
            b.dataset.id = question.id;
            b.querySelector(".questiontext").value =question.question_text;
            b.querySelector(".qoptiona").value =question.option_a;
            b.querySelector(".qoptionb").value =question.option_b;
            b.querySelector(".qoptionc").value =question.option_c;
            b.querySelector(".qoptiond").value =question.option_d;
            b.querySelector(".qcorrectoption").value =question.correct_option;
    });
    } catch (error) {
        console.error(error);
    }
};


if(quizId === null){//the button adds information with POST to server
submitButton.addEventListener("click", async() => {
    const quiztitle = document.querySelector("#quiz-title").value.trim();
    const quizCategory = document.querySelector("#quiz-category").value.trim();
    const quizdiff = document.querySelector("#quiz-difficulty").value.trim();

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
        //test console.log("Fill in every input");
        return message.textContent = "Fill in every input";
    }
   try {
        const response = await fetch("/api/quizzes", {
            method : "POST",
            headers: {"Content-Type": "application/json"},
            body : JSON.stringify({
                title :quiztitle,
                category: quizCategory,
                difficulty:quizdiff,
                questions
            })
        });
        const data = await response.json();
        console.log(response.status,data)
        if(response.ok && data.success){
            window.location.href = "index.html";
        }
        else{
            message.textContent = "Could not create the quiz";
        }


   } catch (error) {
    console.error(error);
    message.textContent = "Could not connect to the server, please try again later"
   }
});
}

else{//edit,same idea but a PUT instead by ID
    //load the information already in the inputs
    loadQuiz(quizId);
submitButton.addEventListener("click", async() => {
    const quiztitle = document.querySelector("#quiz-title").value.trim();
    const quizCategory = document.querySelector("#quiz-category").value.trim();
    const quizdiff = document.querySelector("#quiz-difficulty").value.trim();

    const questions = [];

    //block 1
    const questionblock = document.querySelectorAll(".question-block");//questiontext,qoptiona,qoptionb etc and qcorrectoption.
    questionblock.forEach(b =>{
        questions.push({
             id: Number(b.dataset.id),
            question_text:b.querySelector(".questiontext").value.trim(),
            option_a:b.querySelector(".qoptiona").value.trim(),
            option_b:b.querySelector(".qoptionb").value.trim(),
            option_c:b.querySelector(".qoptionc").value.trim(),
            option_d:b.querySelector(".qoptiond").value.trim(),
            correct_option:b.querySelector(".qcorrectoption").value.trim()//you want A,B,C or D
           
        });
    });
    //pre validate
    if(!quiztitle||!quizCategory||!quizdiff||questions.some(q => Object.values(q).some(v => v === ""))){
        console.log("Fill in every input");
        return message.textContent = "Fill in every input";
    }
   try {
        const response = await fetch("/api/quizzes/"+quizId, {
            method : "PUT",
            headers: {"Content-Type": "application/json"},
            body : JSON.stringify({
                title:quiztitle,
                category:quizCategory,
                difficulty:quizdiff,
                questions
            })
        });
        const data = await response.json();
        if(response.ok&& data.success){
            window.location.href = "index.html";
        }
        else{
            message.textContent = "Could not update the quiz";
        }


   } catch (error) {
    console.error(error);
    message.textContent = "Could not connect to the server, please try again later"
   }
});
}

