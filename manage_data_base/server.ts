import { ApolloServer } from "apollo-server";
import { gql } from "apollo-server";
import { UserInputError } from "apollo-server";
import jwt from "jsonwebtoken";
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

    if (first_name.length < 3)
        throw new UserInputError("first name is too short");
    if (first_name.length > 15)
        throw new UserInputError("first name is too long");
    if (!onlyLetters(first_name))
        throw new UserInputError("first name must contain only letters");

    if (last_name.length < 3)
        throw new UserInputError("last name is too short");
    if (last_name.length > 20)
        throw new UserInputError("last name is too long");
    if (!onlyLetters(last_name))
        throw new UserInputError("last name must contain only letters");

    if (password.length < 8)
        throw new UserInputError("password is too short");
    if (password.length > 20)
        throw new UserInputError("password is too long");

    if (!is_manager && address === "")
        throw new UserInputError("must enter an address");
}

const resolvers = {
    Query: {
        getAllProducts: async (_: any, args: any) => {
            try {
                const all_products = await pool.query(
                "SELECT * FROM products"
                );

                return all_products.rows;
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //get a user's cart product
        getUserCartProducts: async (_: any, args: any) => {
            const { user_id } = args;

            try {
                const cart_products = await pool.query(
                "SELECT * FROM users_products WHERE user_id=$1",
                [user_id]);

                return cart_products.rows;
            } catch (err: any) {
                console.log(err.message);
            }
        },
        //get a product by id
        getProduct:async (_: any, args: any) => {
            const { id } = args;

            try {
                const product = await pool.query(
                "SELECT * FROM products WHERE id=$1",
                [id]);

                return product.rows[0];
            } catch (err: any) {
                console.log(err.message);
            }
        }
    },

    //////////////////////////////////////////////////////////////////

    Mutation: {
        //create a new user
        createUser: async (_: any, args: any) => {
            const { first_name, last_name, password, address,
                email, credit_card_number, is_manager } = args;

            //generate id
            let generate_id;
            try {
                generate_id = await pool.query(
                "SELECT uuid_generate_v4()"
                );
            } catch (err: any) {
                console.log(err.message);
            }
            
            if(!generate_id) {
                throw new UserInputError("try again");
            }
            const id = generate_id.rows[0].uuid_generate_v4;

            //check all the information
            checkRegisterInformation(first_name, last_name, password, address, is_manager);

            //valid email is unique
            var check_email;
            try {
                check_email = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)",
                [email]);
            } catch (err: any) {
                console.log(err.message)
            }

            //if email exists, throw user error
            if (check_email && check_email.rows[0].exists) {
                throw new UserInputError("email already used");
            }

            //generate JWT
            const token = jwt.sign(
                {user_id: id, email, address},
                "TEMP_STRING",
                {
                    //the token will expire in 2 hours
                    expiresIn: "2h"
                }
            );

            //if not, create the user
            try {
                const user = await pool.query(
                    "INSERT INTO users (id,first_name,last_name,password,address,email,credit_card_number,is_manager,token) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING * ",
                    [id, first_name, last_name, password, address, email, credit_card_number, is_manager, token]);
                return user.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //login
        loginUser: async (_: any, args: any) => {
            const { email, password } = args;
            //check email
            var check_user;
            try {
                check_user = await pool.query(
                    "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)",
                    [email])
            } catch (err: any) {
                console.error(err.message);
            }

            // if the email does not exists, error
            if (check_user && !check_user.rows[0].exists) {
                throw new UserInputError("email does not exists");
            }

            //check the password
            try {
                check_user = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1 AND password=$2)",
                [email, password])
            } catch (err: any) {
                console.error(err.message);
            }

            //if the passwords are not the same, error
            if (check_user && !check_user.rows[0].exists) {
                throw new UserInputError("incorrect password");
            }

            let user_address;
            try {
                user_address = await pool.query(
                "SELECT address FROM users WHERE email=$1",
                [email]);
            } catch (err: any) {
                console.error(err.message);
            }

            if(user_address === undefined)
                throw new UserInputError("couldnt find address");

            //if everything is good, login
            try {
                const user = await pool.query(
                "SELECT * FROM users WHERE email=$1 AND password=$2",
                [email, password]);

                const token = jwt.sign(
                    {user_id: user.rows[0].id, email, address: user_address.rows[0].address},
                    "TEMP_STRING",
                    {
                        //the token will expire in 2 hours
                        expiresIn: "2h"
                    }
                );

                //assign the new token
                user.rows[0].token = token;

                return user.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //update product quantity by id
        updateProductQuantity: async(_: any, args: any) => {
            const {id, new_quantity} = args;

            try {
                const update = await pool.query(
                "UPDATE products SET quantity=$1 WHERE id=$2",
                [new_quantity, id]);

                return update.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //add a product to the user's cart
        addProductToCart: async(_: any, args: any) => {
            const { user_id, product_id, size, amount,
                    address, paid, ordering_time, transaction_id } = args;
            
            try {
                const new_product = await pool.query(
                "INSERT INTO users_products (user_id,product_id,address,paid,amount,size,ordering_time,transaction_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING * ",
                [user_id, product_id, address, paid, amount, size, ordering_time, transaction_id]);
                    
                return new_product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //delete a product from the cart of a user
        deleteProductFromCart: async(_: any, args: any) => {
            const { transaction_id } = args;

            try {
                const delete_product = await pool.query(
                "DELETE FROM users_products WHERE transaction_id=$1",
                [transaction_id]);

                return delete_product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //set an item as paid
        setProductAsPaid: async(_: any, args: any) => {
            const { transaction_id } = args;

            try {
                const delete_product = await pool.query(
                "UPDATE users_products SET paid=true WHERE transaction_id=$1",
                [transaction_id]);

                return delete_product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        }
    }
};

const typeDefs = gql`
    
    type User {
        id: String!,
        first_name: String!,
        last_name: String!,
        password: String!,
        address: String!,
        email: String!,
        credit_card_number: String,
        is_manager: Boolean!,
        token: String!
    }

    type Product {
        id: String!,
        name: String!,
        quantity: Int!,
        price: Float!,
        category: String!,
        img_location: String!
    }

    type Users_products {
        user_id: String!,
        product_id: String!,
        address: String!,
        paid: Boolean!,
        amount: Int!,
        size: String!,
        ordering_time: String!,
        transaction_id: String!
    }

    type Wishlist {
        user_id: String!,
        product_id: String!
    }

    type Query {
        getAllProducts: [Product],
        getUserCartProducts(user_id: String!): [Users_products],
        getProduct(id: String!): Product
    }

    type Mutation{
        createUser(first_name: String!,
                   last_name: String!,
                   password: String!,
                   address: String!,
                   email: String!,
                   credit_card_number: String,
                   is_manager: Boolean!): User,

        loginUser(email: String!, password: String!): User,
        updateProductQuantity(id: String!, new_quantity: Int!): Product,
        addProductToCart(user_id: String!,
                         product_id:String!,
                         size: String!,
                         amount: Int!,
                         address: String!,
                         paid: Boolean!,
                         ordering_time: String!,
                         transaction_id: String!): Users_products,

        deleteProductFromCart(transaction_id: String!): Users_products,
        setProductAsPaid(transaction_id: String!): Users_products
    }
`;

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`API is running at: ${url}`);
})

//to run the server: ts-node-esm server.ts