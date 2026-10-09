//this is essentially the same page as "my result" in that you can directly delete from here but add and modify takes you
//to another page!

// ------------------------------
// GET ELEMENTS FROM INDEX.HTML
// ------------------------------

const quizList =
    document.querySelector("#admin-quiz-list");
const adminmessage =
    document.querySelector("#admin-message");
const createquizbutton =
    document.querySelector(".create-quiz-button");


    createquizbutton.type =
        "button";

    createquizbutton.classList.add(
        "create-quiz-button"
    );

    createquizbutton.textContent =
        "Create Quiz";
// ------------------------------
// QUIZ DATA
// ------------------------------

/*
    The array starts empty.

    loadQuizzes() will fill it with data
    retrieved from the server/database.
*/
let quizzes = [];



// ------------------------------
// RENDER QUIZZES
// ------------------------------

function renderQuizzes(quizArray) {

    // Clear previously displayed quizzes
    quizList.replaceChildren();
    

    // Show a message when no quizzes match
    if (quizArray.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.classList.add("empty-message");

        emptyMessage.textContent =
            "No quizzes found.";

        quizList.appendChild(emptyMessage);

        return;
    }


    // Create one card for each quiz
    quizArray.forEach((quiz) => {

        const quizCard = document.createElement("article");
        quizCard.classList.add("quiz-card");


        // Category
        const category =
            document.createElement("p");

        category.classList.add("quiz-category");

        category.textContent =
            quiz.category;


        // Title
        const title = document.createElement("h3");
        title.textContent = quiz.title;


        // Difficulty
        const difficulty = document.createElement("p");
        difficulty.classList.add("quiz-difficulty");
        difficulty.textContent =
            `Difficulty: ${quiz.difficulty}`;


       
    // Delete button
    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.classList.add(
        "delete-result-button"
    );

    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        () => deleteQuiz(
            quiz.quizid,
            quizCard
        )
    );

    //modify
    // Play button
        const updatelink = document.createElement("a");
        updatelink.classList.add("play-quiz-button");
        updatelink.href =
            `admin-quiz.html?id=${quiz.id}`;

        updatelink.textContent =
            "Update Quiz";

        // Add elements to quiz card
        quizCard.appendChild(category);
        quizCard.appendChild(title);
        quizCard.appendChild(difficulty);
        quizCard.appendChild(deleteButton);
        quizCard.appendChild(updatelink);
        


        // Add quiz card to page
        quizList.appendChild(quizCard);
    });
}




// ------------------------------
// LOAD QUIZZES FROM SERVER
// ------------------------------

async function loadQuizzes() {

    /*
        Show loading state while waiting
        for the backend/database.
    */
    quizList.replaceChildren();
    adminmessage.textContent = "Available Quizzes";

    try {

        /*
            Ask the Express backend for quizzes.

            The backend then retrieves them
            from PostgreSQL.
        */
        const response =
            await fetch("/api/quizzes");


        // Handle unsuccessful server responses
        if (!response.ok) {

            throw new Error(
                "Could not load quizzes."
            );
        }


        // Convert server JSON into JavaScript data
        const data =
            await response.json();


        // Save database quizzes in our array
        quizzes = data;


        // Display quizzes from the database
        renderQuizzes(quizzes);


    } catch (error) {

        console.error(
            "Error loading quizzes:",
            error
        );


        // Clear loading message
        quizList.replaceChildren();


        // Show user-friendly server error
        const errorMessage =
            document.createElement("p");

        errorMessage.classList.add(
            "empty-message"
        );

        errorMessage.textContent =
            "Could not load quizzes. Please try again later.";

        quizList.appendChild(errorMessage);
    }
}

//delete
async function deleteQuiz(
    quizid,
    card
) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this quiz?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/quizzes/${quizid}`,
                {
                    method: "DELETE",
                }
            );


        const data =
            await response.json();


        if (!response.ok||data.success) {

            throw new Error(
                data.message ||
                "Could not delete quiz."
            );
        }


        // Remove quiz from page without reload
        card.remove();


        // If no quiz remain, show empty state
        if (
            quizList.children.length === 0
        ) {

            adminmessage.textContent =
                "There arent any quizzes made.";
        }


    } catch (error) {

        console.error(
            "Delete quiz error:",
            error
        );

        alert(
            "Could not delete the quiz."
        );
    }
};




loadQuizzes();