import { randomUUID } from "crypto";

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Routes

//create a record
app.post("/records", async(req, res) => {

    try {

        const { start_time, end_time, daily_bonus, 
                daily_waste, daily_break, user_id, job_id } = req.body;
        
        const newRecord = await pool.query(
            "INSERT INTO records ()"
        );
        
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(5000, () => {

    console.log("server has started on port 5000");
})