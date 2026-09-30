/*
    quizzes.js

    Handles quiz functionality on the homepage.

    Currently:
    - stores temporary quiz data
    - creates quiz cards dynamically
    - searches quizzes by title
    - filters quizzes by category
    - filters quizzes by difficulty

    Later the quiz data will come from the database.
*/


// ------------------------------
// GET ELEMENTS FROM INDEX.HTML
// ------------------------------

const quizList =
    document.querySelector("#quiz-list");

const searchInput =
    document.querySelector("#quiz-search");

const searchStatus =
    document.querySelector("#search-status");

const categoryFilter =
    document.querySelector("#category-filter");

const difficultyFilter =
    document.querySelector("#difficulty-filter");



// ------------------------------
// TEMPORARY QUIZ DATA
// ------------------------------

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


        // Play button
        const playLink = document.createElement("a");
        playLink.classList.add("play-quiz-button");
        playLink.href =
            `play.html?id=${quiz.id}`;

        playLink.textContent =
            "Play Quiz";


        // Add elements to quiz card
        quizCard.appendChild(category);
        quizCard.appendChild(title);
        quizCard.appendChild(difficulty);
        quizCard.appendChild(playLink);


        // Add quiz card to page
        quizList.appendChild(quizCard);
    });
}



// ------------------------------
// SEARCH AND FILTER
// ------------------------------

function applyFilters() {

    // Search text
    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    // Selected category
    const selectedCategory = categoryFilter.value;


    // Selected difficulty
    const selectedDifficulty = difficultyFilter.value;


    // Filter the quiz array
    const filteredQuizzes =
        quizzes.filter((quiz) => {

            const matchesSearch =
                quiz.title
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all" ||
                quiz.category === selectedCategory;


            const matchesDifficulty =
                selectedDifficulty === "all" ||
                quiz.difficulty === selectedDifficulty;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesDifficulty
            );
        });


    // Render filtered quizzes
    renderQuizzes(filteredQuizzes);


    // Hide result count when nothing is being filtered
    if (
        searchTerm === "" &&
        selectedCategory === "all" &&
        selectedDifficulty === "all"
    ) {

        searchStatus.textContent = "";

        return;
    }


    // Show number of matching quizzes
    searchStatus.textContent =
        `${filteredQuizzes.length} quiz(es) found.`;
}



// ------------------------------
// EVENT LISTENERS
// ------------------------------

searchInput.addEventListener(
    "input",
    applyFilters
);

categoryFilter.addEventListener(
    "change",
    applyFilters
);

difficultyFilter.addEventListener(
    "change",
    applyFilters
);



// ------------------------------
// INITIAL PAGE LOAD
// ------------------------------

// Display all quizzes when the page loads
renderQuizzes(quizzes);