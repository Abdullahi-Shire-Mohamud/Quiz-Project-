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


-- ------------------------------
-- QUIZ QUESTIONS
-- ------------------------------


-- HTML Basics
INSERT INTO questions (
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
SELECT
    q.id,
    v.question_text,
    v.option_a,
    v.option_b,
    v.option_c,
    v.option_d,
    v.correct_option,
    v.question_order
FROM quizzes q
CROSS JOIN (
    VALUES
        (
            'Which HTML element is used for the main heading of a page?',
            '<h1>',
            '<p>',
            '<head>',
            '<title>',
            'A',
            1
        ),
        (
            'Which attribute is used to specify the destination of a link?',
            'src',
            'href',
            'alt',
            'class',
            'B',
            2
        ),
        (
            'Which element is used to create an unordered list?',
            '<ol>',
            '<li>',
            '<ul>',
            '<list>',
            'C',
            3
        )
) AS v(
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
WHERE q.title = 'HTML Basics'
AND NOT EXISTS (
    SELECT 1
    FROM questions existing
    WHERE existing.quiz_id = q.id
      AND existing.question_order = v.question_order
);



-- CSS Fundamentals
INSERT INTO questions (
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
SELECT
    q.id,
    v.question_text,
    v.option_a,
    v.option_b,
    v.option_c,
    v.option_d,
    v.correct_option,
    v.question_order
FROM quizzes q
CROSS JOIN (
    VALUES
        (
            'Which CSS property changes the text color?',
            'background-color',
            'font-color',
            'color',
            'text-style',
            'C',
            1
        ),
        (
            'Which CSS property is used to create space inside an element?',
            'margin',
            'padding',
            'gap',
            'border',
            'B',
            2
        ),
        (
            'Which selector targets an element with the id "menu"?',
            '.menu',
            'menu',
            '#menu',
            '*menu',
            'C',
            3
        )
) AS v(
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
WHERE q.title = 'CSS Fundamentals'
AND NOT EXISTS (
    SELECT 1
    FROM questions existing
    WHERE existing.quiz_id = q.id
      AND existing.question_order = v.question_order
);



-- JavaScript Basics
INSERT INTO questions (
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
SELECT
    q.id,
    v.question_text,
    v.option_a,
    v.option_b,
    v.option_c,
    v.option_d,
    v.correct_option,
    v.question_order
FROM quizzes q
CROSS JOIN (
    VALUES
        (
            'Which keyword creates a block-scoped variable that can be reassigned?',
            'const',
            'let',
            'static',
            'define',
            'B',
            1
        ),
        (
            'Which method can be used to select an element by its CSS selector?',
            'document.querySelector()',
            'document.createElement()',
            'document.write()',
            'document.appendChild()',
            'A',
            2
        ),
        (
            'Which event is commonly used when the value of a text input changes while typing?',
            'submit',
            'click',
            'input',
            'load',
            'C',
            3
        )
) AS v(
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
WHERE q.title = 'JavaScript Basics'
AND NOT EXISTS (
    SELECT 1
    FROM questions existing
    WHERE existing.quiz_id = q.id
      AND existing.question_order = v.question_order
);



-- Node.js & Express
INSERT INTO questions (
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
SELECT
    q.id,
    v.question_text,
    v.option_a,
    v.option_b,
    v.option_c,
    v.option_d,
    v.correct_option,
    v.question_order
FROM quizzes q
CROSS JOIN (
    VALUES
        (
            'What is Express mainly used for in this project?',
            'Styling the webpage',
            'Creating server routes and handling HTTP requests',
            'Creating PostgreSQL tables',
            'Editing HTML in the browser',
            'B',
            1
        ),
        (
            'Which Express method is commonly used for a GET endpoint?',
            'app.send()',
            'app.fetch()',
            'app.get()',
            'app.select()',
            'C',
            2
        ),
        (
            'What does express.json() allow the server to do?',
            'Read JSON request bodies',
            'Create CSS files',
            'Connect directly to HTML',
            'Start PostgreSQL',
            'A',
            3
        )
) AS v(
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
)
WHERE q.title = 'Node.js & Express'
AND NOT EXISTS (
    SELECT 1
    FROM questions existing
    WHERE existing.quiz_id = q.id
      AND existing.question_order = v.question_order
);