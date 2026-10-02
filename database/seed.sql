-- Temporary quiz data for development

INSERT INTO quizzes (
    title,
    description,
    category,
    difficulty
)
SELECT
    'HTML Basics',
    'Test your knowledge of basic HTML concepts.',
    'HTML',
    'Easy'
WHERE NOT EXISTS (
    SELECT 1
    FROM quizzes
    WHERE title = 'HTML Basics'
);


INSERT INTO quizzes (
    title,
    description,
    category,
    difficulty
)
SELECT
    'CSS Fundamentals',
    'Test your knowledge of CSS fundamentals.',
    'CSS',
    'Easy'
WHERE NOT EXISTS (
    SELECT 1
    FROM quizzes
    WHERE title = 'CSS Fundamentals'
);


INSERT INTO quizzes (
    title,
    description,
    category,
    difficulty
)
SELECT
    'JavaScript Basics',
    'Test your knowledge of JavaScript basics.',
    'JavaScript',
    'Medium'
WHERE NOT EXISTS (
    SELECT 1
    FROM quizzes
    WHERE title = 'JavaScript Basics'
);


INSERT INTO quizzes (
    title,
    description,
    category,
    difficulty
)
SELECT
    'Node.js & Express',
    'Test your knowledge of Node.js and Express.',
    'Backend',
    'Medium'
WHERE NOT EXISTS (
    SELECT 1
    FROM quizzes
    WHERE title = 'Node.js & Express'
);