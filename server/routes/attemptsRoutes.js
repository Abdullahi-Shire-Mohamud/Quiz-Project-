//route for storing attempt information on table
const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/attempts",async (req,res)=>{//write to table
 const {quizId,score,total,username} = req.body;
 if(!quizId||!username||typeof score!= "number"|| typeof total !="number"){
    return res.status(400).json({success: false, message: "invalid attempt information"});
 }
//write into table
try{
    const result = await pool.query(
        "INSERT INTO attempts (quizid, username, score, total)  VALUES ($1, $2, $3, $4) RETURNING id",
        [quizId, username, score, total]
    );
    if(attemptsresult.rows.length === 0){
        return res.status(400).json({message: "Attempt could not be found"})
    }
    res.json({success: true, id: result.rows[0].id});
}
catch(error){
    console.error(error);
    res.status(500).json({success: false, message:"Could not write to table"});
}
} );//save info about attempt into table


router.get("/attempts/:id",async(req,res)=>{
    try{
    const attemptsresult = await pool.query(
        'SELECT * FROM attempts WHERE id = $1',
        [req.params.id]
    );
    res.json(attemptsresult.rows[0]);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Could not read from table"})
    }
});//read from attempt, used for result.html



module.exports = router;


