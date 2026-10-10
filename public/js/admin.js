//Here we have admin make and modify quizzes by inputting info for fetch, all in one page no stepping or refreshing
const quizId = new URLSearchParams(window.location.search).get("id");

const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#message")
const questionsContainer = document.querySelector("#questions-container");
const addQuestionButton = document.querySelector("#add-question-button");

//create one question block
function createQuestionBlock(question = null) {
    const block =
        document.createElement("div");

    block.classList.add("question-block");

    //save database question id when editing
    if (question) {
        block.dataset.id = question.id;
    }

    const questionNumber =
        questionsContainer.children.length + 1;
    block.innerHTML = `
        <div class="question-block-header">
            <h2>
                Question ${questionNumber}
            </h2>

            <button
                type="button"
                class="remove-question-button">

                Remove

            </button>

        </div>
        <div class="admin-form-group">

            <label>
                Question
            </label>

            <input
                type="text"
                class="questiontext"
                placeholder="Enter the question"
                value="${question ? question.question_text : ""}">

        </div>
        <div class="admin-form-group">

            <label>
                Option A
            </label>

            <input
                type="text"
                class="qoptiona"
                placeholder="Answer option A"
                value="${question ? question.option_a : ""}">

        </div>
        <div class="admin-form-group">

            <label>
                Option B
            </label>

            <input
                type="text"
                class="qoptionb"
                placeholder="Answer option B"
                value="${question ? question.option_b : ""}">

        </div>

        <div class="admin-form-group">

            <label>
                Option C
            </label>

            <input
                type="text"
                class="qoptionc"
                placeholder="Answer option C"
                value="${question ? question.option_c : ""}">

        </div>
        <div class="admin-form-group">

            <label>
                Option D
            </label>

            <input
                type="text"
                class="qoptiond"
                placeholder="Answer option D"
                value="${question ? question.option_d : ""}">

        </div>


        <div class="admin-form-group">

            <label>
                Correct Answer
            </label>

            <select class="qcorrectoption">

                <option value="">
                    Select correct answer
                </option>

                <option value="A">
                    A
                </option>

                <option value="B">
                    B
                </option>

                <option value="C">
                    C
                </option>

                <option value="D">
                    D
                </option>

            </select>

        </div>
    `;

    //set correct answer when editing
    if (question) {

        block.querySelector(
            ".qcorrectoption"
        ).value =
            question.correct_option;
    }

    //remove question button
    const removeButton =
        block.querySelector(
            ".remove-question-button"
        );


    removeButton.addEventListener(
        "click",
        () => {

            block.remove();

            updateQuestionNumbers();
        }
    );
    questionsContainer.appendChild(block);
}
//update question numbers after adding/removing
function updateQuestionNumbers() {
    const blocks =
        document.querySelectorAll(
            ".question-block"
        );
    blocks.forEach((block, index) => {
        block.querySelector("h2").textContent =
            `Question ${index + 1}`;
    });
}
addQuestionButton.addEventListener(
    "click",
    () => {

        createQuestionBlock();
    }
);
//inputs are already shown for the put path
async function loadQuiz(quizId) {
    try {
        const quizzesresult = await fetch("/api/quizzes");
        const questionresult = await fetch("/api/quizzes/questions/" + quizId);

        if (!questionresult.ok || !quizzesresult.ok) {
            throw new Error("Could not load information from the quiz");
        }
        //load all the quizzes and find the one where it matches our id
        const quizzes = await quizzesresult.json();
        const quiz = quizzes.find(quiz => quiz.id === Number(quizId));
        const questions = await questionresult.json();
        //no quiz
        if (!quiz) {
            message.textContent = "Could not find quiz";
            return;
        }
        //update the basic information first
        document.querySelector("#quiz-title").value = quiz.title;
        document.querySelector("#quiz-category").value = quiz.category;
        document.querySelector("#quiz-difficulty").value = quiz.difficulty;

        //clear old question blocks
        questionsContainer.replaceChildren();
        //create one block for every database question
        questions.forEach(question => {
            createQuestionBlock(question);
        });
    } catch (error) {
        console.error(error);
    }
};


if (quizId === null) {//the button adds information with POST to server
    //new quizzes start with three questions
    createQuestionBlock();
    createQuestionBlock();
    createQuestionBlock();

    submitButton.addEventListener("click", async () => {
        const quiztitle = document.querySelector("#quiz-title").value.trim();
        const quizCategory = document.querySelector("#quiz-category").value.trim();
        const quizdiff = document.querySelector("#quiz-difficulty").value.trim();

        const questions = [];

        //block 1
        const questionblock = document.querySelectorAll(".question-block");//questiontext,qoptiona,qoptionb etc and qcorrectoption.
        questionblock.forEach(b => {
            questions.push({
                question_text: b.querySelector(".questiontext").value.trim(),
                option_a: b.querySelector(".qoptiona").value.trim(),
                option_b: b.querySelector(".qoptionb").value.trim(),
                option_c: b.querySelector(".qoptionc").value.trim(),
                option_d: b.querySelector(".qoptiond").value.trim(),
                correct_option: b.querySelector(".qcorrectoption").value.trim(),//you want A,B,C or D
            });
        });
        //pre validate
        if (!quiztitle || !quizCategory || !quizdiff || questions.some(q => Object.values(q).some(v => v === ""))) {
            //test console.log("Fill in every input");
            return message.textContent = "Fill in every input";
        }
        try {
            const response = await fetch("/api/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: quiztitle,
                    category: quizCategory,
                    difficulty: quizdiff,
                    questions
                })
            });
            const data = await response.json();
            console.log(response.status, data)
            if (response.ok && data.success) {
                window.location.href = "admin.html";
            }
            else {
                message.textContent = "Could not create the quiz";
            }


        } catch (error) {
            console.error(error);
            message.textContent = "Could not connect to the server, please try again later"
        }
    });
}

else {//edit,same idea but a PUT instead by ID
    //load the information already in the inputs
    loadQuiz(quizId);
    submitButton.addEventListener("click", async () => {
        const quiztitle = document.querySelector("#quiz-title").value.trim();
        const quizCategory = document.querySelector("#quiz-category").value.trim();
        const quizdiff = document.querySelector("#quiz-difficulty").value.trim();

        const questions = [];

        //block 1
        const questionblock = document.querySelectorAll(".question-block");//questiontext,qoptiona,qoptionb etc and qcorrectoption.
        questionblock.forEach(b => {
            questions.push({
                id: Number(b.dataset.id),
                question_text: b.querySelector(".questiontext").value.trim(),
                option_a: b.querySelector(".qoptiona").value.trim(),
                option_b: b.querySelector(".qoptionb").value.trim(),
                option_c: b.querySelector(".qoptionc").value.trim(),
                option_d: b.querySelector(".qoptiond").value.trim(),
                correct_option: b.querySelector(".qcorrectoption").value.trim()//you want A,B,C or D

            });
        });
        //pre validate
        if (!quiztitle || !quizCategory || !quizdiff || questions.some(q => Object.values(q).some(v => v === ""))) {
            console.log("Fill in every input");
            return message.textContent = "Fill in every input";
        }
        try {
            const response = await fetch("/api/quizzes/" + quizId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: quiztitle,
                    category: quizCategory,
                    difficulty: quizdiff,
                    questions
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                window.location.href = "index.html";
            }
            else {
                message.textContent = "Could not update the quiz";
            }


        } catch (error) {
            console.error(error);
            message.textContent = "Could not connect to the server, please try again later"
        }
    });
}

