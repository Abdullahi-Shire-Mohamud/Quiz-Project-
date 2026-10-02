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


module.exports = router;