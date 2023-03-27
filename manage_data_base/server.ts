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

const manager_password = "secretPassword";

function onlyLetters(str: string) {
    return /^[A-Za-z]*$/.test(str);
}

//check the inforamtion
const checkRegisterInformation = (first_name: string, last_name: string, password: string, address: string, is_manager: boolean) => {

    if (first_name.length < 2)
        throw new UserInputError("first name is too short");
    if (first_name.length > 15)
        throw new UserInputError("first name is too long");
    if (!onlyLetters(first_name))
        throw new UserInputError("first name must contain only letters");

    if (last_name.length < 2)
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

    if(is_manager && password !== manager_password)
        throw new UserInputError("secret password is incorrect");
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
        //get a user's cart products
        getUserCartProducts: async (_: any, args: any) => {
            const { user_id, transaction_id } = args;

            try {
                const cart_products = await pool.query(
                "SELECT * FROM transactions, cart WHERE transactions.user_id=$1 AND transactions.id=$2 AND transactions.id=cart.transaction_id;",
                [user_id, transaction_id]);

                return cart_products.rows;
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //get all paid transactions, and the amount of products they ordered
        getTransactions:async (_: any, args: any) => {
            try {
                const paid_transactions = await pool.query(
                "SELECT id,address,ordering_time, SUM(cart.amount) FROM cart, transactions WHERE paid=true AND cart.transaction_id=transactions.id GROUP BY transactions.id"
                );

                return paid_transactions.rows;
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //get a product by id
        getProduct: async(_: any, args: any) => {
            const { id } = args;

            try {
                const product = await pool.query(
                "SELECT * FROM products WHERE id=$1",
                [id]);

                return product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //get the wishlist products of a user
        getUserWishlist: async(_: any, args: any) => {
            const { user_id } = args;

            try {
                const wishlist_products = await pool.query(
                "SELECT * FROM wishlist WHERE user_id=$1",
                [user_id]);
    
                return wishlist_products.rows;
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //get user information
        getUser: async(_: any, args: any) => {
            const { id } = args;

            try {
                const user = await pool.query(
                "SELECT * FROM users WHERE id=$1",
                [id]);

                return user.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //check if the user has a credit card
        checkForCreditCard: async(_: any, args: any) => {
            const { id } = args;

            try {
                const check = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE id=$1 AND credit_card_number is not null)",
                [id]);

                return check.rows[0].exists;
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //get the id of a transaction that is not paid (of that user)
        getTransactionId:async (_: any, args: any) => {
            const { user_id } = args;

            try {
                const id = await pool.query(
                "SELECT id FROM transactions WHERE user_id=$1 AND paid=false",
                [user_id]);

                return id.rows[0].id;
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //get a transaction by id
        getTransaction:async (_: any, args: any) => {
            const { id } = args;

            try {
                const transaction = await pool.query(
                "SELECT * FROM transactions WHERE id=$1",
                [id]);

                return transaction.rows[0];
            } catch (err: any) {
                console.error(err.message);
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
                console.error(err.message);
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
                console.error(err.message);
            }

            //if email exists, throw user error
            if (check_email && check_email.rows[0].exists) {
                throw new UserInputError("email already used");
            }

            //generate JWT
            const token = jwt.sign(
                {user_id: id, email, is_manager},
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

            let is_user_manager;
            try {
                is_user_manager = await pool.query(
                "SELECT is_manager FROM users WHERE email=$1",
                [email]);
            } catch (err: any) {
                console.error(err.message);
            }

            if(is_user_manager === undefined)
                throw new UserInputError("unknown error");

            //if everything is good, login
            try {
                const user = await pool.query(
                "SELECT * FROM users WHERE email=$1 AND password=$2",
                [email, password]);

                const token = jwt.sign(
                    {user_id: user.rows[0].id, email, is_manager: is_user_manager.rows[0].is_manager},
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
        //create a new transaction for a user
        createTransaction: async(_: any, args: any) => {
            const { user_id, address, paid, ordering_time } = args;
            
            try {
                const new_transaction = await pool.query(
                "INSERT INTO transactions(address,paid,ordering_time,user_id) VALUES($1,$2,$3,$4) RETURNING * ",
                [address, paid, ordering_time, user_id]);
                    
                return new_transaction.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //delete a transaction
        deleteTransaction: async(_: any, args: any) => {
            const { transaction_id } = args;

            //delete the items of that transaction first
            try {
                const delete_transaction_items = await pool.query(
                "DELETE FROM cart WHERE transaction_id=$1",
                [transaction_id]);
            } catch (err: any) {
                console.error(err.message);
            }

            //then delete the transaction
            try {
                const delete_transaction = await pool.query(
                "DELETE FROM transactions WHERE id=$1",
                [transaction_id]);

                return delete_transaction.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //add a product to the transaction (to the cart)
        addProductToCart:async (_: any, args: any) => {
            const { item_id, transaction_id, product_id, amount, size } = args;

            try {
                const new_product = await pool.query(
                "INSERT INTO cart(item_id,transaction_id,product_id,amount,size) VALUES($1,$2,$3,$4,$5)",
                [item_id, transaction_id, product_id, amount, size]);

                return new_product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //deletes a product from a transaction (from the cart)
        removeProductFromCart:async (_: any, args: any) => {
            const { item_id } = args;

            try {
                const new_product = await pool.query(
                "DELETE FROM cart WHERE item_id=$1",
                [item_id]);

                return new_product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //set an item as paid
        setTransactionAsPaid: async(_: any, args: any) => {
            const { transaction_id, new_time } = args;

            try {
                const update = await pool.query(
                "UPDATE transactions SET paid=true, ordering_time=$2 WHERE id=$1",
                [transaction_id, new_time]);

                return update.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //add a product to the wishlist
        addToWishlist: async(_: any, args: any) => {
            const { user_id, product_id } = args;

            let check_if_exists;
            try {
                check_if_exists = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM wishlist WHERE user_id=$1 AND product_id=$2)",
                [user_id, product_id]);
            } catch (err: any) {
                console.error(err.message);
            }

            if (check_if_exists?.rows[0].exists) {
                throw new UserInputError("product is already in the wishlist");
            }

            try {
                const wishlist_product = await pool.query(
                "INSERT INTO wishlist (user_id, product_id) VALUES($1,$2) RETURNING * ",
                [user_id, product_id]);

                return wishlist_product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //delete product from the user's wishlist
        deleteProductFromWishlist: async(_: any, args: any) => {
            const { user_id, product_id } = args;

            try {
                const delete_product = await pool.query(
                "DELETE FROM wishlist WHERE user_id=$1 AND product_id=$2",
                [user_id, product_id]);
    
                return delete_product.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //update the quantity of the cart product
        updateCartProductAmount: async(_: any, args: any) => {
            const { item_id, new_amount } = args;

            try {
                const update = await pool.query(
                "UPDATE cart SET amount=$1 WHERE item_id=$2",
                [new_amount, item_id]);

                return update.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //update the size of the cart product
        updateCartProductSize: async(_: any, args: any) => {
            const { item_id, new_size } = args;

            try {
                const update = await pool.query(
                "UPDATE cart SET size=$1 WHERE item_id=$2",
                [new_size, item_id]);

                return update.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //update user information
        updateUserInformation: async(_: any, args: any) => {
            const { id, first_name, last_name, password, address, email, is_manager } = args;

            //check the new values are valid
            checkRegisterInformation(first_name, last_name, password, address, is_manager);
        
            //valid email is unique
            var check_email;
            try {
                check_email = await pool.query(
                "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1 AND id!=$2)",
                [email, id]);
            } catch (err: any) {
                console.error(err.message);
            }

            //if email used with another user, throw user error
            if (check_email && check_email.rows[0].exists) {
                throw new UserInputError("email already used");
            }

            try {
                const update = await pool.query(
                "UPDATE users SET first_name=$1, last_name=$2, password=$3, address=$4, email=$5 WHERE id=$6",
                [first_name, last_name, password, address, email, id]);

                return update.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //add a credit card to a user
        addCreditCard: async(_: any, args: any) => {
            const { id, credit_card_number } = args;

            try {
                const update = await pool.query(
                "UPDATE users SET credit_card_number=$1 WHERE id=$2",
                [credit_card_number, id]);

                return update.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //remove a credit card of a user
        removeCreditCard: async(_: any, args: any) => {
            const { id } = args;

            try {
                const remove = await pool.query(
                "UPDATE users SET credit_card_number=null WHERE id=$1",
                [id]);

                return remove.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //update product details
        updateProductDetails: async(_: any, args: any) => {
            const { id, price, quantity, category, img_uploaded } = args;

            try {
                const update = await pool.query(
                "UPDATE products SET price=$1, quantity=$2, category=$3, img_uploaded=$4 WHERE id=$5",
                [price, quantity, category, img_uploaded, id]);

                return update.rows[0];
            } catch (err: any) {
                console.error(err.message);
            }
        },
        //add a product to the products
        addProductToProducts: async(_: any, args: any) => {
            const { name, price, quantity, category, img_location } = args;

            try {
                const new_product = await pool.query(
                "INSERT INTO products (name,quantity,price,category,img_location) VALUES($1,$2,$3,$4,$5) RETURNING *",
                [name, price, quantity, category, img_location]);

                return new_product.rows[0];
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
        img_location: String!,
        img_uploaded: Boolean!
    }

    type Transactions {
        id: String!,
        user_id: String!,
        address: String!,
        paid: Boolean!,
        ordering_time: String!
    }

    type TransactionsSecondType {
        id: String!,
        address: String!,
        ordering_time: String!,
        sum: Int!
    }

    type Cart {
        item_id: String!,
        product_id: String!,
        transaction_id: String!,
        amount: Int!,
        size: String!
    }

    type Wishlist {
        user_id: String!,
        product_id: String!
    }

    type Query {
        getAllProducts: [Product],
        getUserCartProducts(user_id: String!, transaction_id: String!): [Cart],
        getTransactions: [TransactionsSecondType],
        getProduct(id: String!): Product,
        getUserWishlist(user_id: String!): [Wishlist],
        getUser(id: String!): User,
        checkForCreditCard(id: String!): Boolean,
        getTransactionId(user_id: String!): String,
        getTransaction(id: String!): Transactions
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
        createTransaction(user_id: String!,
                         address: String!,
                         paid: Boolean!,
                         ordering_time: String!): Transactions,

        updateUserInformation(id: String!,
                              first_name: String!,
                              last_name: String!,
                              password: String!,
                              address: String,
                              email: String!
                              is_manager: Boolean!): User,

        deleteTransaction(transaction_id: String!): Transactions,
        setTransactionAsPaid(transaction_id: String!, new_time: String!): Transactions,
        addToWishlist(user_id: String!, product_id: String!): Wishlist,
        deleteProductFromWishlist(user_id: String!, product_id: String!): Wishlist,
        updateCartProductAmount(item_id: String!, new_amount: Int!): Cart,
        updateCartProductSize(item_id: String!, new_size: String!): Cart,
        addCreditCard(id: String!, credit_card_number: String!): User,
        removeCreditCard(id: String!): User,
        removeProductFromCart(item_id: String!): Cart,
        addProductToCart(item_id: String!,
                         transaction_id: String!,
                         product_id: String!,
                         amount: Int!,
                         size: String!): Cart,

        updateProductDetails(id: String!,
                             price: Int!,
                             quantity: Int!,
                             category: String!,
                             img_uploaded: Boolean!): Product,

        addProductToProducts(name: String!,
                             price: Int!,
                             quantity: Int!,
                             category: String!,
                             img_location: String!): Product
    }
`;

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`API is running at: ${url}`);
})

//to run the server: ts-node-esm server.ts