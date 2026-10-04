//route for storing attempt information on table
const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/attempts", async (req, res) => {//write to table
    const { quizId, score, total, username } = req.body;
    if (!quizId || !username || typeof score != "number" || typeof total != "number") {
        return res.status(400).json({ success: false, message: "Invalid attempt information" });
    }
    //write into table
    try {

        const result = await pool.query(
            `
            INSERT INTO attempts (
                quiz_id,
                username,
                score,
                total
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [
                quizId,
                username,
                score,
                total
            ]
        );


        return res.json({
            success: true,
            id: result.rows[0].id
        });


    } catch (error) {

        console.error("Attempt save error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not save attempt."
        });
    }
});

router.get("/attempts/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                attempts.id,
                attempts.username,
                attempts.score,
                attempts.total,
                attempts.created_at,
                quizzes.id AS quiz_id,
                quizzes.title AS quiz_title
            FROM attempts
            JOIN quizzes
                ON attempts.quiz_id = quizzes.id
            WHERE attempts.id = $1
            `,
            [req.params.id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Attempt not found."
            });
        }


        return res.json(result.rows[0]);
    }
    catch (error) {

        console.error("Attempt read error:", error);

        return res.status(500).json({
            message: "Could not read attempt."
        });
    }
});//read from attempt, used for result.html



module.exports = router;


