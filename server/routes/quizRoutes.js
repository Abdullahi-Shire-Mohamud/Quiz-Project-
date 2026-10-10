const express = require("express");
const pool = require("../db");

const router = express.Router();


// -------------------------------------
// GET ALL QUIZZES
// GET /api/quizzes
// -------------------------------------

router.get("/quizzes", async (req, res) => {

    try {

       const result = await pool.query(`
            SELECT
                id,
                title,
                description,
                category,
                difficulty,
                created_at
            FROM quizzes
            ORDER BY id
        `);
        return res.json(result.rows);

    } catch (error) {

        console.error("Quiz database error:", error);

        return res.status(500).json({
            message: "Could not load quizzes."
        });
    }
});

router.get("/quizzes/questions/:quizId", async (req, res) => {
    console.log("Question route test");
    try {
        const answerResult = await pool.query(
            'SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = $1 ORDER BY question_order',
            [req.params.quizId]
        );
        res.json(answerResult.rows);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Could not load questions."
        });
    }

});

//for making a quiz
router.post("/quizzes", async (req, res) => {
    const { title, category, difficulty, questions } = req.body;
    //testconsole.log("Post innehåll:",JSON.stringify(req.body),null,2);

    //validate
    if (typeof title != "string" || typeof category != "string" || typeof difficulty != "string" || questions.length === 0) {
        res.status(400).json({ success: false, message: "Invalid data" });
    }
    if (!questions.every(q => ["question_text", "option_a", "option_b", "option_c", "option_d", "correct_option"].every(v => typeof q[v] === "string")
        && (["A","B","C","D"].includes(q.correct_option)))) {
        return res.status(400).json({ success: false, message: "Invalid question data" });
    }
    //commit
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const MainQuiz = await client.query(`INSERT INTO quizzes (title, category, difficulty) VALUES ($1, $2, $3) RETURNING id`,
            [title.trim(), category.trim(), difficulty.trim()]
        );
        const quiz_id = MainQuiz.rows[0].id;
        for (let i = 0; i < questions.length; i++) {

            const q = questions[i];
            //testconsole.log(q);
            await client.query(
                `
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
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `,
                [
                    quiz_id,
                    q.question_text.trim(),
                    q.option_a.trim(),
                    q.option_b.trim(),
                    q.option_c.trim(),
                    q.option_d.trim(),
                    q.correct_option,
                    i + 1
                ]
            );
        }
        await client.query("COMMIT");
        res.json({ success: true, id: quiz_id })

    }
    catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "CREATE QUIZ ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Could not create the quiz, please try again later"
        });
    }

    finally {
        client.release();
    }

});

//modify with PUT
router.put("/quizzes/:id", async (req, res) => {

    const quizId = Number(req.params.id);

    const {
        title,
        category,
        difficulty,
        questions
    } = req.body;


    // Validate quiz information
    if (
        typeof title !== "string" ||
        title.trim() === "" ||
        typeof category !== "string" ||
        category.trim() === "" ||
        !["Easy", "Medium", "Hard"].includes(difficulty) ||
        !Array.isArray(questions) ||
        questions.length === 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid quiz data"
        });
    }


    // Validate questions
    const questionsAreValid =
        questions.every(question =>

            typeof question.question_text === "string" &&
            question.question_text.trim() !== "" &&

            typeof question.option_a === "string" &&
            question.option_a.trim() !== "" &&

            typeof question.option_b === "string" &&
            question.option_b.trim() !== "" &&

            typeof question.option_c === "string" &&
            question.option_c.trim() !== "" &&

            typeof question.option_d === "string" &&
            question.option_d.trim() !== "" &&

            ["A", "B", "C", "D"].includes(
                question.correct_option
            )
        );


    if (!questionsAreValid) {

        return res.status(400).json({
            success: false,
            message: "Invalid question data"
        });
    }


    const client =
        await pool.connect();


    try {

        await client.query("BEGIN");


        // Update quiz information
        const quizResult =
            await client.query(
                `
                UPDATE quizzes

                SET
                    title = $1,
                    category = $2,
                    difficulty = $3

                WHERE id = $4

                RETURNING id
                `,
                [
                    title.trim(),
                    category.trim(),
                    difficulty,
                    quizId
                ]
            );


        if (quizResult.rowCount === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }


        // Delete old questions
        await client.query(
            `
            DELETE FROM questions
            WHERE quiz_id = $1
            `,
            [quizId]
        );


        // Insert the current questions again
        for (
            let i = 0;
            i < questions.length;
            i++
        ) {

            const question =
                questions[i];


            await client.query(
                `
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

                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8
                )
                `,
                [
                    quizId,
                    question.question_text.trim(),
                    question.option_a.trim(),
                    question.option_b.trim(),
                    question.option_c.trim(),
                    question.option_d.trim(),
                    question.correct_option,
                    i + 1
                ]
            );
        }


        await client.query("COMMIT");


        res.json({
            success: true,
            message: "Quiz updated successfully"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "UPDATE QUIZ ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Could not update quiz"
        });

    } finally {

        client.release();
    }
});

//DELETE 
router.delete("/quizzes/:id", async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const deleteQuiz = await client.query(
            `
    DELETE FROM quizzes
    WHERE id = $1
    `,
            [req.params.id]
        );
        //if there isnt anything to delete
        if (deleteQuiz.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ success: false, message: "Couldn't find quiz" });
        };

        await client.query("COMMIT");
        res.json({ success: true })

    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error(error)
        res.status(500).json({ success: false, message: "Could not delete, please try again later" })

    }
    finally {
        client.release();
    }
});

module.exports = router;