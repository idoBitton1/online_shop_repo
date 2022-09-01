const { gql } = require("apollo-server");

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
        getAllExtras(user_id: String!, job_id: String!): [Extra],
        validateUser(username: String!, password: String!): String,
        getJobByName(name: String!): Job
    }

    type Mutation{
        createUser(username: String!, password: String!): User,
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
                    job_id: String!): Extra
    }
`;

module.exports = { typeDefs };