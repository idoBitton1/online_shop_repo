const express = require("express");
const app = express();
const PORT = 5000;
const pool = require("./db");
const graphql = require("graphql");
const { 
    buildSchema,
    GraphQLSchema, 
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull } = graphql;
const { graphqlHTTP } = require("express-graphql");

const schema = buildSchema(`

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
        hours_amount: String!,
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

    type Query {
        getAllRecords(user_id: String!, job_id: String!): [Record],
        getAllSpecialRecords(user_id: String!, job_id: String!): [Special_record],
        getSpecialRecordTypeByType(type: String!): Special_record_type,
        getAllExtras(user_id: String!, job_id: String!): [Extra],
        validateUser(username: String!, password: String!): String
        getJobByName(name: String!): Job
    }
`)

var root = {
    //get all the records of a user in the current job
    getAllRecords: async({user_id, job_id}) => {
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
    getAllSpecialRecords: async({user_id, job_id}) => {
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
    getSpecialRecordTypeByType: async({type}) => {
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
    getAllExtras: async({user_id, job_id}) => {
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
    validateUser: async({username, password}) => {
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
    getJobByName: async(args) => {
        try {
            const is_valid = await pool.query(
            "SELECT * FROM jobs WHERE name=$1",
            [args.name])
            return is_valid.rows[0];
        } catch (err) {
            console.error(err.message);
        }
    }
}

/*
const mutation = new GraphQLObjectType({

});
*/

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log("server has started on port " + PORT);
})