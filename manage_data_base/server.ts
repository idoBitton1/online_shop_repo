import { ApolloServer } from "apollo-server";
import { gql } from "apollo-server";
import { UserInputError } from "apollo-server";
import pg from "pg";

const pool = new pg.Pool({
    user: "postgres",
    password: "mpmpiv100",
    host: "localhost",
    port: 5432,
    database: "shop_me_online"
});

const resolvers = {
    Query: {
        getAll: async (_: any, args: any) => {
            try {
                const all_jobs = await pool.query(
                "SELECT * FROM users"
                );
                return all_jobs.rows;
            } catch (err: any) {
                console.error(err.message);
            }
        }
    },

    Mutation: {
        //create a new user
        createUser: async(_: any, args: any) => {
            const {first_name, last_name, password, address,
                   email, credit_card_number, is_manager} = args;
            
            try {
                const user = await pool.query(
                "INSERT INTO users (first_name,last_name,password,address,email,credit_card_number,is_manager) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING * ",
                [first_name, last_name, password, address, email, credit_card_number, is_manager]);
                return user.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        }
    }
};

const typeDefs = gql`
    
    type User{
        id: String!,
        first_name: String!,
        last_name: String!,
        password: String!,
        address: String!,
        email: String!,
        credit_card_number: String,
        is_manager: Boolean!    
    }

    type Product{
        id: String!,
        name: String!,
        quantity: Int!,
        price: Float!,
        category: String!,
        img_location: String!
    }

    type users_products{
        user_id: String!,
        product_id: String!,
        address: String!,
        paid: Boolean!,
        amount: Int!,
        size: String!,
        ordering_time: String!
    }

    type wishlist{
        user_id: String!,
        product_id: String!
    }

    type Query{
        getAll: [User]
    }

    type Mutation{
        createUser(first_name: String!,
                   last_name: String!,
                   password: String!,
                   address: String!,
                   email: String!,
                   credit_card_number: String,
                   is_manager: Boolean!): User
    }
`;

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({ url }) => {
    console.log(`API is running at: ${url}`);
})

//to run the server: ts-node-esm server.ts