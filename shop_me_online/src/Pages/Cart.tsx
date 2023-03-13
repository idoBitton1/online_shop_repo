import React, { useEffect, useState } from "react";
import './Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { GET_USER_CART_PRODUCTS, CHECK_FOR_CREDIT_CARD, GET_USER, GET_TRANSACTION_ID, GET_ALL_PRODUCTS } from "../Queries/Queries";
import { CREATE_TRANSACTION, SET_TRANSACTION_AS_PAID, UPDATE_PRODUCT_QUANTITY } from "../Queries/Mutations";

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../state";
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

//components
import { Header } from "../Components/Header/Header";
import { CartProductDisplay } from "../Components/products/CartProductDisplay";

//material - ui
import { Button, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

//icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { CreditCardForm } from "../Components/Forms/CreditCardForm";

//function
import { formatDate } from "./Home";

export interface PaymentProps {
    sum_of_products: number,
    delivery: number,
    total: number,
    payment_succeed: boolean
}

const Cart = () => {
    //redux states
    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);
    const products = useSelector((redux_state: ReduxState) => redux_state.products);
    const transaction_id = useSelector((redux_state: ReduxState) => redux_state.transaction_id);

    //redux actions
    const dispatch = useDispatch();
    const { setCart, updateSupply, setTransactionId, setProducts, setFilterProducts } = bindActionCreators(actionsCreators, dispatch);

    //const value
    const delivery_price = 30;

    //states
    const [payment_information, setPaymentInformation] = useState<PaymentProps>({
        sum_of_products: 0,
        delivery: delivery_price,
        total: 0,
        payment_succeed: false
    });
    const [has_credit_card, setHasCreditCard] = useState<boolean>(false);
    const [open_credit_card, setOpenCreditCard] = useState<boolean>(false);
    const [open_confirm, setOpenConfirm] = useState<boolean>(false);
    const [err_text, setErrText] = useState<string>("");

    //queries
    const [getTransactionId] = useLazyQuery(GET_TRANSACTION_ID, {
        fetchPolicy: "network-only",
        onCompleted(data) {
            setTransactionId(data.getTransactionId);
        },
    });
    //get the user's address
    const { data: address_data } = useQuery(GET_USER, {
        fetchPolicy: "network-only",
        variables: {
            userId: user.token?.user_id
        }
    });
    //get all products, because the cart products dont hold the same information as the 
    //regular products is holding (such as the price, img_location)
    useQuery(GET_ALL_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted(data) {
          setProducts(data.getAllProducts);
          setFilterProducts(data.getAllProducts);
        }
    });
    //when the info comes back, set the information in the cart redux state
    const [getCartProducts] = useLazyQuery(GET_USER_CART_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted(data) {
            setCart(data.getUserCartProducts);
        }
    });
    //checks if the user has a credit card set
    useQuery(CHECK_FOR_CREDIT_CARD, {
        fetchPolicy: "network-only",
        variables: {
            id: user.token?.user_id
        },
        onCompleted(data) {
            setHasCreditCard(data.checkForCreditCard);
        },
    });

    //mutations
    //update the quantity of an item  
    const [updateProductQuantity] = useMutation(UPDATE_PRODUCT_QUANTITY);
    //sets the transaction as paid
    const [setTransactionAsPaid] = useMutation(SET_TRANSACTION_AS_PAID);
    //create a transaction
    const [createTransaction] = useMutation(CREATE_TRANSACTION, {
        onCompleted(data) { 
          //if created a new one, set the new transaction id to the redux state
          setTransactionId(data.createTransaction.id);
        }
    });


    //when the user is connecting, fetch his cart information
    useEffect(() => {
        if (user.token && transaction_id) {
            getCartProducts({
                variables: {
                    user_id: user.token.user_id,
                    transaction_id: transaction_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token, transaction_id]);

    //if the user is connected and the transaction id wasnt fetched yet
    useEffect(() => {
        if (user.token && !transaction_id) {
            //so fetch it
            getTransactionId({
                variables: {
                    user_id: user.token.user_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token]);

    //change the total with every change in the amount of one of the fields 
    useEffect(() => {
        setPaymentInformation((prev) => ({...prev, total: payment_information.sum_of_products + payment_information.delivery}));
    }, [payment_information.sum_of_products, payment_information.delivery]);

    //the function of the pay button click
    const handlePayment = async() => {
        //check that the selected products are in stock
        for(let i = 0; i < cart.length; i++) {
            let index_of_product = products.products.findIndex((product) => product.id === cart[i].product_id);
            if (products.products[index_of_product].quantity < cart[i].amount) {
                setErrText("not enough in stock");
                return;
            }
        }

        //type declare
        type temp_cart_type = {
            product_id: string,
            amount: number
        }

        //sums for each product in the cart his amount
        let temp_cart: temp_cart_type[] = [];
        for(let i = 0; i < cart.length; i++) {
            //if already sumed his amount, skip him
            if(temp_cart.findIndex((item) => item.product_id === cart[i].product_id) !== -1)
                continue;
            let sum = 0;
            //sum only the amount of the current item
            cart.filter((item) => item.product_id === cart[i].product_id).map((item) => {
                sum += item.amount;
            });
            temp_cart.push({product_id: cart[i].product_id, amount: sum});
        }
        
        //updates the products arrays quantities
        for(let i = 0; i< temp_cart.length; i++) {
            orderProduct(temp_cart[i].amount, temp_cart[i].product_id);
        }

        //set the transaction as paid
        const formatted_now = formatDate();
        setTransactionAsPaid({
            variables: {
                transaction_id: transaction_id,
                new_time: formatted_now
            }
        });

        //create a new transaction after the prev transaction was paid
        createTransaction({
            variables: {
                user_id: user.token?.user_id,
                address: address_data.getUser.address,
                paid: false,
                ordering_time: formatted_now
            }
        });

        //update the payment variables
        setPaymentInformation((prev) => {
            return {
                ...prev,
                payment_succeed: true,
                sum_of_products: 0,
                delivery: 0
            }
        });

        toggleConfirmDialog();
    }

    //updates the products arrays quantities (all the products that are bought)
    const orderProduct = async(amount: number, product_id: string) => {
        //finds the quantity of the product
        const product_index = products.products.findIndex((product) => product.id === product_id);
        const quantity = products.products[product_index].quantity;

        //update both arrays
        updateSupply({
            id: product_id,
            amount: amount
        });

        //update db
        try {
            await updateProductQuantity({
                variables: {
                    id: product_id,
                    newQuantity: quantity - amount
                }
            });
        } catch (err: any) {
            console.error(err.message);
        }
    }

    const toggleCreditCardDialog = () => {
        setOpenCreditCard((prev) => !prev);
    }

    const toggleConfirmDialog = () => {
        setOpenConfirm((prev) => !prev);
    }

    return (
        <>
        <div className="cart_container">
            <Header />

            <h1 className="headline"> Your Cart </h1>

            <div className="cart_context">
                <div className="payment_section">
                    <div className="summary_container">
                        <p style={{ fontWeight: "bold" }}>Summary</p>

                        <div className="summary_field">
                            <p>Subtotal</p>
                            <p>{payment_information.sum_of_products}$</p>
                        </div>
                        <div className="summary_field">
                            <p>Delivery</p>
                            <p>{payment_information.delivery}$</p>
                        </div>
                        <div className="total_field">
                            <p>Total</p>
                            <p>{payment_information.total}$</p>
                        </div>
                        
                        {/** check if the user has a credit card */}
                        <Button onClick={!has_credit_card ? toggleCreditCardDialog : toggleConfirmDialog}
                            variant="contained"
                            fullWidth
                            >
                            Pay
                        </Button>

                        <p>{err_text ? err_text : ""}</p>   
                    </div>

                    {
                        payment_information.payment_succeed
                        ?
                        <div className="payment_succeeded">
                            <CheckCircleRoundedIcon color="success" fontSize="large" />
                            <h2 style={{color: "green"}}>Payment Succeed</h2>
                        </div>
                        :
                        <></>
                    }
                </div>

                <div className="cart_items">
                    {
                        payment_information.payment_succeed
                        ?
                        <></>
                        :
                        //render all the products in the cart
                        cart.map((cart_product, i) => {
                            const product_index = products.products.findIndex((product) => product.id === cart_product.product_id);
                            const img_location = products.products[product_index].img_location;
                            const img_uploaded = products.products[product_index].img_uploaded;

                            return (
                                <CartProductDisplay
                                    item_id={cart_product.item_id}
                                    product_id={cart_product.product_id}
                                    amount={cart_product.amount}
                                    size={cart_product.size}
                                    img_location={img_location}
                                    img_uploaded={img_uploaded}
                                    setPaymentInformation={setPaymentInformation}
                                    key={i}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>



        {/* add credit card dialog */}
        <Dialog open={open_credit_card} onClose={toggleCreditCardDialog} fullWidth>
            <DialogTitle>
                <Typography
                fontSize={25}
                borderBottom={1}
                borderColor={"lightgray"}
                gutterBottom>
                    Add credit card
                </Typography>
            </DialogTitle>

            <DialogContent>
                <p style={{fontFamily: "Rubik", marginTop: -1}}>
                    seems like you dont have a credit card set...
                </p>
                <CreditCardForm 
                toggleDialog={toggleCreditCardDialog}
                setHasCreditCard={setHasCreditCard}
                />
            </DialogContent>
        </Dialog>


        {/* confirm purchase */}
        <Dialog open={open_confirm} onClose={toggleConfirmDialog}>
            <DialogTitle>
                <Typography
                fontSize={25}
                borderBottom={1}
                borderColor={"lightgray"}
                gutterBottom>
                    Confirm your purchase
                </Typography>
            </DialogTitle>

            <DialogContent>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Button 
                    onClick={toggleConfirmDialog}
                    variant="outlined"
                    color="error"
                    >
                        Cancel
                    </Button>

                    <Button 
                    onClick={handlePayment}
                    variant="contained"
                    color="success"
                    >
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default Cart;