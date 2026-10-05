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

//for making a quiz
router.post("/quizzes", async (req,res) => {
    const {title,category,diff,questions} = req.body;

    //validate
    if(typeof title != "string"||typeof category != "string"|| typeof diff != "string"|| questions.length === 0 ){
        res.status(400).json({success: false, message : "Invalid data"});
    }
    if(!questions.every(q=> ["question_text","option_a","option_b","option_c","option_d","correct_option"].every(v=> typeof q[v] === "string")
    && (q.correct_option === ("A"||"B"||"C"||"D") ))){
    return res.status(400).json({success: false, message : "Invalid question data"});
    }
    //commit
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const MainQuiz = await client.query('INSERT INTO quizzes(title,category,difficulty) VALUES ($1,$2,$3 RETURNING id',
            [title.trim(),category.trim(),diff.trim()]
        );
        const quiz_id = MainQuiz.rows[0].id;
        for(const q of questions){
            await client.query('INSERT INTO questions(quiz_id,question_text,option_a,option_b,option_c,option_d,correct_option) VALUES ($1,$2,$3,$4,$5,$6,$7)',
                [quiz_id,q.question_text.trim(),q.optiona.trim(),q.optionb.trim(),q.optionc.trim(),q.optiond.trim(),q.correct_option]
            );
        };
     await client.query("COMMIT");
     res.json({success : true, id: quiz_id})

    }
    catch (error) {
        await client.query("ROLLBACK");
        res.status(500).json({succuss: false, message:"Could not create the quiz, please try again later"})

    }
    finally{
        client.release();
    }


    //insert quiz

    //insert questions 

    //return success or failure, then release


});

module.exports = router;