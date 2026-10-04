/*
    results.js

    Loads the saved quiz attempt
    after a quiz has been completed.
*/


// Get attempt ID from:
// results.html?id=5
const attemptId =
    new URLSearchParams(
        window.location.search
    ).get("id");


const resultTitle =
    document.querySelector("#result-title");

const resultScore =
    document.querySelector("#result-score");

const resultMessage =
    document.querySelector("#result-message");



async function loadResult() {

    // No attempt ID was provided
    if (!attemptId) {

        resultTitle.textContent =
            "Result not found.";

        return;
    }


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


        // Give simple feedback
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


loadResult();