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

router.get("/quizzes/questions/:quizId", async(req, res) => {
    console.log("Question route test");
try {
    const answerResult = await pool.query(
        'SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = $1 ORDER BY id',
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

module.exports = router;