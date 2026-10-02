-- Quizzes are the main content users can browse and play
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,

    title VARCHAR(120) NOT NULL,
    description TEXT,

    category VARCHAR(50) NOT NULL,

    difficulty VARCHAR(10) NOT NULL
        CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

-- Questions belong to a specific quiz
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,

    quiz_id INTEGER NOT NULL
        REFERENCES quizzes(id)
        ON DELETE CASCADE,

    question_text TEXT NOT NULL,

    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,

    correct_option CHAR(1) NOT NULL
        CHECK (correct_option IN ('A', 'B', 'C', 'D')),

    question_order INTEGER NOT NULL
);