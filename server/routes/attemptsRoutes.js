//route for storing attempt information on table
const express = require("express");
const pool = require("../db");
const sessions = require("../sessionStore");

const router = express.Router();

function authUser(req, res, next) {

    const token =
        req.signedCookies.authToken;

    if (!token || !sessions[token]) {

        return res.status(401).json({
            success: false,
            message: "You must be logged in."
        });
    }

    req.user = sessions[token];

    next();
}

router.post("/attempts",authUser, async (req, res) => {//write to table
    const username = req.user.username;
    const { quizId, score, total } = req.body;
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

router.get("/attempts/:id",authUser, async (req, res) => {
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
            WHERE attempts.id = $1 AND attempts.username = $2
            `,
            [req.params.id,req.user.username]
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

//read for history page, get all attempts by username
router.get("/attempts",authUser, async (req, res) => {
    const username = req.user.username;
    if (!username) {

        return res.status(400).json({
            message: "Username is required."
        });
    }

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
                WHERE attempts.username = $1
                ORDER BY attempts.created_at DESC
            `,
            [req.user.username]
        );
        return res.json(result.rows);//returns a whole array thats will be looped over
    }
    catch (error) {

        console.error("Attempt read error:", error);

        return res.status(500).json({
            message: "Could not read attempt."
        });
    }
});

// -------------------------------------
// DELETE ONE RESULT FROM USER HISTORY
// DELETE /api/attempts/:id
// -------------------------------------

router.delete(
    "/attempts/:id",
    authUser,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    DELETE FROM attempts
                    WHERE id = $1
                    AND username = $2
                    RETURNING id
                    `,
                    [
                        req.params.id,
                        req.user.username
                    ]
                );


            if (result.rowCount === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Result not found."
                });
            }


            return res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "Delete attempt error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Could not delete result."
            });
        }
    }
);

module.exports = router;


