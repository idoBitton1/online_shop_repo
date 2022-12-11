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

function onlyLetters(str: string) {
    return /^[A-Za-z]*$/.test(str);
}

//check the inforamtion
const checkRegisterInformation = (first_name: string, last_name: string, password: string, address: string, is_manager: boolean) => {
    
    if(first_name.length < 3)
        throw new UserInputError("first name is too short");
    if(first_name.length > 15)
        throw new UserInputError("first name is too long");
    if(!onlyLetters(first_name))
        throw new UserInputError("first name must contain only letters");

    if(last_name.length < 3)
        throw new UserInputError("last name is too short");
    if(last_name.length > 20)
        throw new UserInputError("last name is too long");
    if(!onlyLetters(last_name))
        throw new UserInputError("last name must contain only letters");
    
    if(password.length < 8)
        throw new UserInputError("password is too short");
    if(password.length > 20)
        throw new UserInputError("password is too long");
    
    if(!is_manager && address === "")
        throw new UserInputError("must enter an address");
}

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
            
            checkRegisterInformation(first_name, last_name, password, address, is_manager);
            
            var check_email;
            try {
                check_email = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)",    
                [email]);
            } catch (err:any) {
                console.log(err.message)
            }
       
            //if email exists, throw user error
            if(check_email && check_email.rows[0].exists){
                throw new UserInputError("email already used");
            }

            //if not, create the user
            try {
                const user = await pool.query(
                "INSERT INTO users (first_name,last_name,password,address,email,credit_card_number,is_manager) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING * ",
                [first_name, last_name, password, address, email, credit_card_number, is_manager]);
                return user.rows[0];
            } catch (err:any) {
                console.error(err.message);
            }
        },
        //login
        loginUser: async(_: any, args: any) => {
            const { email, password } = args;
            //check email
            var check_user;
            try {
                check_user = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)",
                [email])
            } catch (err:any) {
                console.error(err.message);
            }

            // if the email does not exists, error
            if(check_user && !check_user.rows[0].exists){
                throw new UserInputError("email does not exists");
            }

            //check the password
            try {
                check_user = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1 AND password=$2)",
                [email, password])
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
                "SELECT * FROM users WHERE email=$1 AND password=$2",
                [email, password])
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
                   is_manager: Boolean!): User,

        loginUser(email: String!, password: String!): User
    }
`;

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({ url }) => {
    console.log(`API is running at: ${url}`);
})

//to run the server: ts-node-esm server.ts