import { ApolloServer } from "apollo-server";
import { gql } from "apollo-server";
import { UserInputError } from "apollo-server";
import pg from "pg";

const pool = new pg.Pool({
    user: "postgres",
    password: "mpmpiv100",
    host: "localhost",
    port: 5432,
    database: "shift_manager"
});

const checkPassword = (password: string, confirm_password: string) => {

    if (password.search(/\d/) == -1) {
        return "please add at least 1 number";
    } else if (password.search(/[a-zA-Z]/) == -1) {
        return "please add at least 1 letter";
    } else if(password !== confirm_password){
        return "passwords do not match";
    }

    return "";
}

const resolvers = {
    Query: {
        //get all the records of a user in the current job
        getAllRecords: async(_: any, args: any) => {
            const {user_id, job_id} = args;
            try {
                const records = await pool.query(
                "SELECT * FROM records WHERE user_id=$1 AND job_id=$2 ",
                [user_id, job_id])
                return records.rows;
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //get all special records of a user from the current job
        getAllSpecialRecords: async(_: any, args: any) => {
            const {user_id, job_id} = args;
            try {
                const special_records = await pool.query(
                "SELECT * FROM special_records WHERE user_id=$1 AND job_id=$2 ",
                [user_id, job_id])
                return special_records.rows;
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //get a special record type by type
        getSpecialRecordTypeByType: async(_: any, args: any) => {
            const {type} = args;
            try {
                const special_record_type = await pool.query(
                "SELECT * FROM special_record_types WHERE type = $1 ",
                [type]);
                return special_record_type.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //get a special record type by id
        getSpecialRecordTypeById: async(_: any, args: any) => {
            const {id} = args;
            try {
                const special_record_type = await pool.query(
                "SELECT * FROM special_record_types WHERE id = $1 ",
                [id]);
                return special_record_type.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //get all extra records of a user from the current job
        getAllExtras: async(_: any, args: any) => {
            const {user_id, job_id} = args;
            try {
                const extra = await pool.query(
                "SELECT * FROM extras WHERE user_id=$1 AND job_id=$2 ",
                [user_id, job_id])
                return extra.rows;
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //get job by name
        getJobByName: async(_: any, args: any) => {
            const { name } = args;
            try {
                const job = await pool.query(
                "SELECT * FROM jobs WHERE name=$1",
                [name])
                return job.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //get job by id
        getJobById: async(_: any, args: any) => {
            const { id } = args;
            try {
                const job = await pool.query(
                "SELECT * FROM jobs WHERE id=$1",
                [id])
                return job.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //get user by id
        getUserById: async(_: any, args: any) => {
            const { id } = args;
            try {
                const user = await pool.query(
                "SELECT * FROM users WHERE id=$1",
                [id])
                return user.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        }
    },

    Mutation: {
        //create a new user
        createUser: async(_: any, args: any) => {
            const {username, password, confirm_password} = args;

            var check_username;
            try {
                check_username = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)",    
                [username])
            } catch (err:any) {
                console.log(err.message)
            }

            if(check_username && check_username.rows[0].exists){
                throw new UserInputError("username already used");
            }

            const pass_check = checkPassword(password, confirm_password);
            if(pass_check !== "")
                throw new UserInputError(pass_check);

            try {
                const user = await pool.query(
                "INSERT INTO users (id,username,password) VALUES(uuid_generate_v4(),$1,$2) RETURNING * ",
                [username, password]);
                return user.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //create a new record
        createRecord: async(_: any, args: any) => {
            const {start_time, end_time, daily_break, user_id, job_id} = args;
            try {
                const record = await pool.query(
                "INSERT INTO records (id,start_time,end_time,daily_break,user_id,job_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4,$5) RETURNING * ",
                [start_time, end_time, daily_break, user_id, job_id]);
                return record.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        // create a new special record
        createSpecialRecord: async(_: any, args: any) => {
            const {date, hours_amount, user_id, job_id, special_record_type_id} = args;
            try {
                const special_record = await pool.query(
                "INSERT INTO special_records (id,date,hours_amount,user_id,job_id,special_record_type_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4,$5) RETURNING * ",
                [date, hours_amount, user_id, job_id, special_record_type_id]);
                return special_record.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //create a new extra record
        createExtra: async(_: any, args: any) => {
            const {date, bonus, amount, description, user_id, job_id} = args;
            try {
                const extra = await pool.query(
                "INSERT INTO extras (id,date,bonus,amount,description,user_id,job_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4,$5,$6) RETURNING * ",
                [date, bonus, amount, description, user_id, job_id]);
                return extra.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //update the hourly salary
        updateSalary: async(_: any, args: any) => {
            const { id, salary_per_hour } = args;
            try {
                const update = await pool.query(
                "UPDATE jobs SET salary_per_hour=$1 WHERE id=$2",
                [salary_per_hour, id])

                const job = await pool.query(
                "SELECT * FROM jobs WHERE id=$1",
                [id])
                return job.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //login
        loginUser: async(_: any, args: any) => {
            const { username, password } = args;
            //check user
            var check_user;
            try {
                check_user = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)",
                [username])
            } catch (err:any) {
                console.error(err.message);
            }

            // if the user does not exists, error
            if(check_user && !check_user.rows[0].exists){
                throw new UserInputError("user does not exists");
            }

            //check the password
            try {
                check_user = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE username=$1 AND password=$2)",
                [username, password])
            } catch (err:any) {
                console.error(err.message);
            }

            //if the passwords are not the same, error
            if(check_user && !check_user.rows[0].exists){
                throw new UserInputError("incorrect password");
            }

            //if everything is good, login
            try {
                const user = await pool.query(
                "SELECT * FROM users WHERE username=$1 AND password=$2",
                [username, password])
                return user.rowCount;
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //delete record
        deleteRecord:   async (_: any, args: any) => {
            const { id } = args;
            try {
                const delete_record = await pool.query(
                "DELETE FROM records WHERE id=$1 ",
                [id])
                return delete_record.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //delete special record
        deleteSpecialRecord: async (_: any, args: any) => {
            const { id } = args;
            try {
                const delete_special_record = await pool.query(
                "DELETE FROM special_records WHERE id=$1 ",
                [id])
                return delete_special_record.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //delete extra record
        deleteExtraRecord: async (_: any, args: any) => {
            const { id } = args;
            try {
                const delete_extra_record = await pool.query(
                "DELETE FROM extras WHERE id=$1 ",
                [id])
                return delete_extra_record.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        }
    }  
};

const typeDefs = gql`

    type Record{
        id: String!,
        start_time: String!,
        end_time: String!,
        daily_break: Int!,
        user_id: String!,
        job_id: String!
    }

    type Special_record{
        id: String!,
        date: String!,
        hours_amount: Int!,
        user_id: String!,
        job_id: String!,
        special_record_type_id: String!
    }

    type Special_record_type{
        id: String!,
        type: String!,
        percentage: Int!
    }

    type Extra{
        id: String!,
        date: String!,
        bonus: Boolean!,
        amount: Int!,
        description: String,
        user_id: String!,
        job_id: String!
    }

    type Job{
        id: String!,
        name: String!,
        type: String!,
        salary_per_hour: Int!
    }

    type User{
        id: String!,
        username: String!,
        password: String!
    }

    type Query {
        getAllRecords(user_id: String!, job_id: String!): [Record],
        getAllSpecialRecords(user_id: String!, job_id: String!): [Special_record],
        getSpecialRecordTypeByType(type: String!): Special_record_type,
        getSpecialRecordTypeById(id: String!): Special_record_type,
        getAllExtras(user_id: String!, job_id: String!): [Extra],
        getJobByName(name: String!): Job,
        getJobById(id: String!): Job,
        getUserById(id: String!): User
    }

    type Mutation{
        createUser(username: String!, password: String!, confirm_password: String!): User,
        createRecord(start_time: String!,
                     end_time: String!, 
                     daily_break: Int!, 
                     user_id: String!, 
                     job_id: String!): Record,

        createSpecialRecord(date: String!, 
                            hours_amount: Int!, 
                            user_id: String!, 
                            job_id: String!, 
                            special_record_type_id: String!): Special_record,
        
        createExtra(date: String!,
                    bonus: Boolean!,
                    amount: Int!,
                    description: String,
                    user_id: String!, 
                    job_id: String!): Extra,
        
        updateSalary(id: String!, salary_per_hour: Int!): Job,
        loginUser(username: String!, password: String!): User,
        deleteRecord(id: String!): Record,
        deleteSpecialRecord(id: String!): Special_record,
        deleteExtraRecord(id: String!): Extra
    }
`;

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({ url }) => {
    console.log(`API is running at: ${url}`);
})