const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Routes

//create a new record
app.post("/records", async(req, res) => {

    try {
        //variables
        const { id,start_time,end_time,
                daily_break,user_id,job_id } = req.body;
        
        //the query
        const new_record = await pool.query(
        "INSERT INTO records (id,start_time,end_time,daily_break,user_id,job_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING * ",
        [id,start_time,end_time,daily_break,user_id,job_id]);
        
        res.json(new_record.rows[0]);
    } catch (err: any) {
        console.error(err.message);
    }
});

//get all records
app.get("/records", async(req, res) => {

    try {
        const all_records = await pool.query("SELECT start_time,end_time,daily_break FROM records");

        res.json(all_records.rows);
    } catch (err: any) {
        console.error(err.message);
    }
});

//create a new special record
app.post("/special_records", async(req, res) => {

    try {
        //variables
        const { id,date,hours_amount,type,percentage,
                user_id,job_id,special_type_id} = req.body;
        
        //the query
        const new_special_record = await pool.query(
        "INSERT INTO special_records (id,date,hours_amount,type,percentage,user_id,job_id,special_type_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING * ",
        [id,date,hours_amount,type,percentage,user_id,job_id,special_type_id]);
        
        res.json(new_special_record.rows[0]);
    } catch (err: any) {
        console.error(err.message);
    }
});

//get all special records
app.get("/special_records", async(req, res) => {

    try {
        const all_special_records = await pool.query("SELECT date,hours_amount,type FROM special_records");

        res.json(all_special_records.rows);
    } catch (err: any) {
        console.error(err.message);
    }
});

//get the percentage and id of a specific special record type, by type
app.get("/special_record_types/:type", async(req, res) => {

    try {
        const { type } = req.params;
        const result = await pool.query(
        "SELECT percentage,special_type_id FROM special_record_types WHERE type = $1",
        [type]);

        res.json(result.rows[0]);
    } catch (err: any) {
        console.error(err.message);
    }
})

//create new extra
app.post("/extras", async(req, res) => {

    try {
        //variables
        const { id,date,bonus,amount,
                description,user_id,job_id} = req.body;
        
        //the query
        const new_extra = await pool.query(
        "INSERT INTO extras (id,date,bonus,amount,description,user_id,job_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING * ",
        [id,date,bonus,amount,description,user_id,job_id]);

        res.json(new_extra.rows[0]);
    } catch (err: any) {
        console.error(err.message);
    }
});

//get all extras
app.get("/extras", async(req, res) => {

    try {
        const all_extras = await pool.query("SELECT date,bonus,amount,description FROM extras");

        res.json(all_extras.rows);
    } catch (err: any) {
        console.error(err.message);
    }
});

//create a new user
app.post("/users", async(req, res) => {

    try {
        //variables
        const { id, username, password } = req.body;

        //the query
        const new_user = await pool.query(
        "INSERT INTO users (id,username,password) VALUES($1,$2,$3) RETURNING * ",
        [id,username,password]);

        res.json(new_user.rows[0]);
    } catch (err: any) {
        console.error(err.message);
    }
});

//get salary of a specific job, by job id
app.get("/jobs/:id", async(req, res) => {

    try {
        const { id } = req.params;
        const salary = await pool.query(
        "SELECT salary_per_hour FROM jobs WHERE id = $1",
        [id]);

        res.json(salary.rows[0]);
    } catch (err: any) {
        console.error(err.message);
    }
})

//
//
//
app.listen(5000, () => {

    console.log("server has started on port 5000");
})