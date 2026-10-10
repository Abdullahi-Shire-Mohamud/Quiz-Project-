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
    const { title, category, difficulty, questions } = req.body;
    //validate same as POST
    if (
        typeof title !== "string" ||
        typeof category !== "string" ||
        typeof difficulty !== "string" ||
        !Array.isArray(questions) ||
        questions.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        });
    }
    if (!questions.every(q => ["question_text", "option_a", "option_b", "option_c", "option_d", "correct_option"].every(v => typeof q[v] === "string")
        && ["A", "B", "C", "D"].includes(q.correct_option))) {
        return res.status(400).json({ success: false, message: "Invalid question data" });
    }

    //commit
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const updateQuiz = await client.query('UPDATE quizzes SET title = $1, category = $2, difficulty = $3 WHERE id = $4',
            [title.trim(), category.trim(), difficulty.trim(), req.params.id]
        );
        //if there isnt anything to update
        if (updateQuiz.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ success: false, message: "Couldnt find quiz" });
        }

        for (const q of questions) {
            const resultq = await client.query('UPDATE questions SET question_text = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_option = $6 WHERE id = $7 AND quiz_id = $8',
                [q.question_text.trim(), q.option_a.trim(), q.option_b.trim(), q.option_c.trim(), q.option_d.trim(), q.correct_option, q.id, req.params.id]
            );
            //checks for question just incase if we get back no question.
            if (resultq.rowCount === 0) {
                throw new Error("The question missing");
            };
        };

        await client.query("COMMIT");
        res.json({ success: true })

    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ success: false, message: "Could not update, please try again later" })

    }
    finally {
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