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