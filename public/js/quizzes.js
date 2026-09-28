const quizList = document.querySelector("#quiz-list");


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


    quizArray.forEach((quiz) => {

        // Create quiz card
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


// Render quizzes when page loads
renderQuizzes(quizzes);