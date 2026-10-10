/*
    quizzes.js

    Handles quiz functionality on the homepage.

    Currently:
    - loads quizzes from the backend using fetch()
    - creates quiz cards dynamically
    - searches quizzes by title
    - filters quizzes by category
    - filters quizzes by difficulty
    - sorts quizzes

    Quiz data now comes from PostgreSQL through:
    GET /api/quizzes
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

const sortFilter =
    document.querySelector("#sort-filter");



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
// SEARCH + FILTER + SORT
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

    // Selected sorting option
    const selectedSort = sortFilter.value;

    // Filter the quiz array
    let filteredQuizzes =
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


    // ------------------------------
    // SORT QUIZZES
    // ------------------------------

    /*
        Create a copy before sorting.

        .sort() changes the original array,
        so using [...filteredQuizzes] prevents
        unwanted changes to our quiz data.
    */

    filteredQuizzes = [...filteredQuizzes];

    // Sort quiz titles alphabetically A-Z
    if (selectedSort === "name-asc") {

        filteredQuizzes.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }


    // Sort quiz titles alphabetically Z-A
    else if (selectedSort === "name-desc") {

        filteredQuizzes.sort((a, b) =>
            b.title.localeCompare(a.title)
        );
    }

    else if (selectedSort === "difficulty-asc") {

        const difficultyOrder = {
            Easy: 1,
            Medium: 2,
            Hard: 3
        };


        // Easy -> Medium -> Hard
        filteredQuizzes.sort(
            (a, b) =>
                difficultyOrder[a.difficulty] -
                difficultyOrder[b.difficulty]
        );
    }


    // Hard -> Medium ->Easy
    else if (selectedSort === "difficulty-desc") {

        const difficultyOrder = {
            Easy: 1,
            Medium: 2,
            Hard: 3
        };

        filteredQuizzes.sort(
            (a, b) =>
                difficultyOrder[b.difficulty] -
                difficultyOrder[a.difficulty]
        );
    }


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
    if (filteredQuizzes.length === 0) {

        searchStatus.textContent = "";

    } else {

        searchStatus.textContent =
            `${filteredQuizzes.length} quiz(es) found.`;
    }
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

    const loadingMessage =
        document.createElement("p");

    loadingMessage.textContent =
        "Loading quizzes...";

    quizList.appendChild(loadingMessage);


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

// Update quiz order when sorting changes
sortFilter.addEventListener(
    "change",
    applyFilters
);



// ------------------------------
// INITIAL PAGE LOAD
// ------------------------------

// Display all quizzes when the page loads
loadQuizzes();