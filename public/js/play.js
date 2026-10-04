// Get quiz ID from play.html?id=1
const idfromURL =
    new URLSearchParams(window.location.search).get("id");

// Get logged-in username
const username =
    localStorage.getItem("username");


// User must be logged in to play
if (!username) {
    window.location.href = "login.html";
}


let questions = [];
let currentQuestionID = 0;
let score = 0;


// Page elements
const question =
    document.querySelector("#question");

const buttons =
    document.querySelectorAll(".answer-button");


// Maps button index to answer letter
const correctOptionLetter =
    ["A", "B", "C", "D"];


// -------------------------------------
// FETCH QUESTIONS
// -------------------------------------

async function fetchQuestions() {

    try {

        const response = await fetch(
            `/api/quizzes/questions/${idfromURL}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch questions."
            );
        }

        questions =
            await response.json();


        if (questions.length === 0) {

            question.textContent =
                "No questions are available for this quiz.";

            return;
        }


        showQuestion();

    } catch (error) {

        console.error(error);

        question.textContent =
            "Failed to load quiz content. Please try again.";
    }
}


// -------------------------------------
// SHOW CURRENT QUESTION
// -------------------------------------

function showQuestion() {

    const currentQuestion =
        questions[currentQuestionID];


    // Prevent reading past the end of the array
    if (!currentQuestion) {
        return;
    }


    question.textContent =
        currentQuestion.question_text;


    const optionText = [
        currentQuestion.option_a,
        currentQuestion.option_b,
        currentQuestion.option_c,
        currentQuestion.option_d
    ];


    buttons.forEach((button, index) => {

        button.textContent =
            optionText[index];

        // Enable buttons for the next question
        button.disabled = false;
    });
}


// -------------------------------------
// ANSWER BUTTONS
// -------------------------------------

buttons.forEach((button, index) => {

    button.addEventListener("click", async () => {

        // Prevent clicks after final question
        if (currentQuestionID >= questions.length) {
            return;
        }


        const currentQuestion =
            questions[currentQuestionID];


        // Check answer
        if (
            correctOptionLetter[index] ===
            currentQuestion.correct_option
        ) {
            score++;
        }


        currentQuestionID++;


        // Show next question
        if (currentQuestionID < questions.length) {

            showQuestion();

            return;
        }


        // Quiz is finished
        buttons.forEach((button) => {
            button.disabled = true;
        });


        // -------------------------------------
        // SAVE ATTEMPT
        // -------------------------------------

        try {

            const response = await fetch(
                "/api/attempts",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        quizId: Number(idfromURL),
                        score: score,
                        total: questions.length,
                        username: username
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Attempt save failed:",
                    data
                );

                question.textContent =
                    data.message ||
                    "Could not save your attempt.";

                return;
            }


            if (data.success) {

                window.location.href =
                    `results.html?id=${data.id}`;
            }

        } catch (error) {

            console.error(
                "Attempt save error:",
                error
            );

            question.textContent =
                "Could not save your attempt. Please try again later.";
        }
    });
});


fetchQuestions();