const pool = require("../db");

const resolvers = {
    Query: {
        //get all the records of a user in the current job
        getAllRecords: async(_, args) => {
            const {user_id, job_id} = args;
            try {
                const records = await pool.query(
                "SELECT * FROM records WHERE user_id=$1 AND job_id=$2 ",
                [user_id, job_id])
                return records.rows;
            } catch (err) {
                console.error(err.message);
            }
        },
        //get all special records of a user from the current job
        getAllSpecialRecords: async(_, args) => {
            const {user_id, job_id} = args;
            try {
                const special_records = await pool.query(
                "SELECT * FROM special_records WHERE user_id=$1 AND job_id=$2 ",
                [user_id, job_id])
                return special_records.rows;
            } catch (err) {
                console.error(err.message);
            }
        },
        //get a special record type by type
        getSpecialRecordTypeByType: async(_, args) => {
            const {type} = args;
            try {
                const special_record_type = await pool.query(
                "SELECT * FROM special_record_types WHERE type = $1 ",
                [type])
                return special_record_type.rows[0];
            } catch (err) {
                console.error(err.message);
            }
        },
        //get all extra records of a user from the current job
        getAllExtras: async(_, args) => {
            const {user_id, job_id} = args;
            try {
                const extra = await pool.query(
                "SELECT * FROM extras WHERE user_id=$1 AND job_id=$2 ",
                [user_id, job_id])
                return extra.rows;
            } catch (err) {
                console.error(err.message);
            }
        },
        //validates if a user is exists, used to check if login details are true
        validateUser: async(_, args) => {
            const {username, password} = args;
            try {
                const is_valid = await pool.query(
                "SELECT validate_user($1,$2)",
                [username, password])
                return is_valid.rows[0];
            } catch (err) {
                console.error(err.message);
            }
        },
        //get job by name
        getJobByName: async(_, args) => {
            const { name } = args;
            try {
                const is_valid = await pool.query(
                "SELECT * FROM jobs WHERE name=$1",
                [name])
                return is_valid.rows[0];
            } catch (err) {
                console.error(err.message);
            }
        }
    },

    Mutation: {
        //create a new user
        createUser: async(_, args) => {
            const {username, password} = args;
            try {
                const user = await pool.query(
                "INSERT INTO users (id,username,password) VALUES(uuid_generate_v4(),$1,$2) RETURNING * ",
                [username, password]);
                return user.rows[0];
            } catch (err) {
                console.error(err.message);
            }
        },
        //create a new record
        createRecord: async(_, args) => {
            const {start_time, end_time, daily_break, user_id, job_id} = args;
            try {
                const record = await pool.query(
                "INSERT INTO records (id,start_time,end_time,daily_break,user_id,job_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4,$5) RETURNING * ",
                [start_time, end_time, daily_break, user_id, job_id]);
                return record.rows[0];
            } catch (err) {
                console.error(err.message);
            }
        },
        // create a new special record
        createSpecialRecord: async(_, args) => {
            const {date, hours_amount, user_id, job_id, special_record_type_id} = args;
            try {
                const special_record = await pool.query(
                "INSERT INTO special_records (id,date,hours_amount,user_id,job_id,special_record_type_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4,$5) RETURNING * ",
                [date, hours_amount, user_id, job_id, special_record_type_id]);
                return special_record.rows[0];
            } catch (err) {
                console.error(err.message);
            }
        },
        //create a new extra record
        createExtra: async(_, args) => {
            const {date, bonus, amount, description, user_id, job_id} = args;
            try {
                const extra = await pool.query(
                "INSERT INTO extras (id,date,bonus,amount,description,user_id,job_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4,$5,$6) RETURNING * ",
                [date, bonus, amount, description, user_id, job_id]);
                return extra.rows[0];
            } catch (err) {
                console.error(err.message);
            }
        }
    }  
};

module.exports = { resolvers };