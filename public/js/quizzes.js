const quizList = document.querySelector("#quiz-list");

// Search input
const searchInput = document.querySelector("#quiz-search");

// Displays information about search results
const searchStatus = document.querySelector("#search-status");


// Temporary quiz data.
// Later this will come from the database using fetch().
const quizzes = [
    {
        id: 1,
        title: "HTML Basics",
        category: "HTML",
        difficulty: "Easy"
    },
    {
        id: 2,
        title: "CSS Fundamentals",
        category: "CSS",
        difficulty: "Easy"
    },
    {
        id: 3,
        title: "JavaScript Basics",
        category: "JavaScript",
        difficulty: "Medium"
    },
    {
        id: 4,
        title: "Node.js & Express",
        category: "Backend",
        difficulty: "Medium"
    }
];


function renderQuizzes(quizArray) {

    // Remove old cards before rendering
    quizList.replaceChildren();

    // Show a message if there are no quizzes to display
    if (quizArray.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No quizzes found.";

        quizList.appendChild(emptyMessage);

        return;
    }

    // Create one card for every quiz
    quizArray.forEach((quiz) => {


        const quizCard = document.createElement("article");
        quizCard.classList.add("quiz-card");


        // Category
        const category = document.createElement("p");
        category.classList.add("quiz-category");
        category.textContent = quiz.category;


        // Title
        const title = document.createElement("h3");
        title.textContent = quiz.title;


        // Difficulty
        const difficulty = document.createElement("p");
        difficulty.classList.add("quiz-difficulty");
        difficulty.textContent = `Difficulty: ${quiz.difficulty}`;


        // Play link
        const playLink = document.createElement("a");
        playLink.classList.add("play-quiz-button");

        playLink.href = `play.html?id=${quiz.id}`;

        playLink.textContent = "Play Quiz";


        // Add everything to the card
        quizCard.appendChild(category);
        quizCard.appendChild(title);
        quizCard.appendChild(difficulty);
        quizCard.appendChild(playLink);


        // Add card to quiz list
        quizList.appendChild(quizCard);
    });
}

// Search quizzes
searchInput.addEventListener("input", () => {

    // Get what the user typed
    const searchTerm =
        searchInput.value.trim().toLowerCase();
    // Keep quizes whose title contains the user's search term
    const filteredQuizzes = quizzes.filter((quiz) => {

        return quiz.title
            .toLowerCase()
            .includes(searchTerm);

    });

    // Display the matching quizzes
    renderQuizzes(filteredQuizzes);

    // No search term? Show all quizzes
    if (searchTerm === "") {

        searchStatus.textContent = "";

        return;
    }


    // Show how many quizzes matched
    searchStatus.textContent =
        `${filteredQuizzes.length} quiz(es) found.`;

});

// Show all quizzes when the page first loads
renderQuizzes(quizzes);