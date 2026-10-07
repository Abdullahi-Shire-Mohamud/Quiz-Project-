/*
    results.js

    Displays either:
    1. One completed quiz result
    2. The logged-in user's result history
*/


// Get attempt ID from:
// results.html?id=5
const attemptId =
    new URLSearchParams(
        window.location.search
    ).get("id");


const username =
    localStorage.getItem("username");


// Single result elements
const singleResult =
    document.querySelector("#single-result");

const resultTitle =
    document.querySelector("#result-title");

const resultScore =
    document.querySelector("#result-score");

const resultMessage =
    document.querySelector("#result-message");


// History elements
const resultsHistory =
    document.querySelector("#results-history");

const history =
    document.querySelector("#history");

const historyStatus =
    document.querySelector("#history-status");



// -------------------------------------
// LOAD ONE RESULT
// -------------------------------------

async function loadResult() {

    try {

        const response =
            await fetch(`/api/attempts/${attemptId}`);


        if (!response.ok) {

            throw new Error(
                "Could not load result."
            );
        }


        const attempt =
            await response.json();


        // Display quiz title
        resultTitle.textContent =
            attempt.quiz_title;


        // Display score
        resultScore.textContent =
            `Score: ${attempt.score} / ${attempt.total}`;


        // Final message
        if (attempt.score === attempt.total) {

            resultMessage.textContent =
                "Perfect score! 🎉";

        } else if (
            attempt.score >= attempt.total / 2
        ) {

            resultMessage.textContent =
                "Good job! Keep practicing ✨";

        } else {

            resultMessage.textContent =
                "Keep practicing — you can try again!";
        }


    } catch (error) {

        console.error(
            "Result loading error:",
            error
        );

        resultTitle.textContent =
            "Could not load your result.";
    }
}



// -------------------------------------
// LOAD RESULT HISTORY
// -------------------------------------

async function loadResultHistory() {

    if (!username) {

        historyStatus.textContent =
            "Please log in to view your results.";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/attempts?username=${encodeURIComponent(username)}`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load result history."
            );
        }


        const attempts =
            await response.json();


        // Remove old content before rendering
        history.replaceChildren();


        if (attempts.length === 0) {

            historyStatus.textContent =
                "You have not completed any quizzes yet.";

            return;
        }


        historyStatus.textContent = "";


        attempts.forEach((attempt) => {

            createAttemptCard(attempt);

        });


    } catch (error) {

        console.error(
            "Result history error:",
            error
        );

        historyStatus.textContent =
            "Could not load your results.";
    }
}



// -------------------------------------
// CREATE ATTEMPT CARD
// -------------------------------------

function createAttemptCard(attempt) {

    const card =
        document.createElement("article");

    card.classList.add("attempts-block");

    card.dataset.attemptId =
        attempt.id;


    // Quiz title
    const title =
        document.createElement("h3");

    title.textContent =
        attempt.quiz_title;


    // Score
    const score =
        document.createElement("p");

    score.textContent =
        `Score: ${attempt.score} / ${attempt.total}`;


    // Date
    const date =
        document.createElement("p");

    const formattedDate =
        new Date(
            attempt.created_at
        ).toLocaleString();

    date.textContent =
        `Date: ${formattedDate}`;


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
        () => deleteAttempt(
            attempt.id,
            card
        )
    );


    card.appendChild(title);
    card.appendChild(score);
    card.appendChild(date);
    card.appendChild(deleteButton);

    history.appendChild(card);
}



// -------------------------------------
// DELETE ONE ATTEMPT
// -------------------------------------

async function deleteAttempt(
    attemptId,
    card
) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this result?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/attempts/${attemptId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not delete result."
            );
        }


        // Remove result from page without reload
        card.remove();


        // If no attempts remain, show empty state
        if (
            history.children.length === 0
        ) {

            historyStatus.textContent =
                "You have not completed any quizzes yet.";
        }


    } catch (error) {

        console.error(
            "Delete result error:",
            error
        );

        alert(
            "Could not delete the result."
        );
    }
}



// -------------------------------------
// CHOOSE PAGE MODE
// -------------------------------------

if (attemptId) {

    singleResult.hidden = false;
    resultsHistory.hidden = true;

    loadResult();

} else {

    singleResult.hidden = true;
    resultsHistory.hidden = false;

    loadResultHistory();
}