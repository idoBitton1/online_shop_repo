import React, { useEffect, useState } from "react";
import './Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { GET_USER_CART_PRODUCTS, GET_USER_WISHLIST, CHECK_FOR_CREDIT_CARD, GET_TRANSACTION, GET_USER, GET_TRANSACTION_ID } from "../Queries/Queries";
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
    const wishlist = useSelector((redux_state: ReduxState) => redux_state.wishlist);
    const products = useSelector((redux_state: ReduxState) => redux_state.products);
    const transaction_id = useSelector((redux_state: ReduxState) => redux_state.transaction_id);

    //redux actions
    const dispatch = useDispatch();
    const { setCart, dontFetch, setWishlist, updateSupply, setTransactionId } = bindActionCreators(actionsCreators, dispatch);

    //const value
    const delivery_ground_price = 15;

    //states
    const [payment_information, setPaymentInformation] = useState<PaymentProps>({
        sum_of_products: 0,
        delivery: 0,
        total: 0,
        payment_succeed: false
    });
    const [has_credit_card, setHasCreditCard] = useState<boolean>(false);
    const [open_credit_card, setOpenCreditCard] = useState<boolean>(false);
    const [open_confirm, setOpenConfirm] = useState<boolean>(false);
    const [err_text, setErrText] = useState<string>("");

    //queries
    const [getTransactionId, { data: transaction_data }] = useLazyQuery(GET_TRANSACTION_ID);
    const [getAddress, { data: address_data }] = useLazyQuery(GET_USER);
    //when the info comes back, set the information in the cart redux state
    const [getCartProducts] = useLazyQuery(GET_USER_CART_PRODUCTS, {
        onCompleted(data) {
            if(cart.length === 0) { //if the cart is empty when entering the cart page
                setCart(data.getUserCartProducts);
            }
            else {
                window.location.reload(); //refresh the page, in case the fetch will not bring all the info at the first time
            }
        }
    });
    //when the info comes back, set the information in the wishlist redux state
    const [getWishlistProducts] = useLazyQuery(GET_USER_WISHLIST, {
        onCompleted(data) {
            if(wishlist.length === 0) {
                setWishlist(data.getUserWishlist);
            }
            else {
                window.location.reload();
            }
        }
    });
    //checks if the user has a credit card set
    const { data: credit_data } = useQuery(CHECK_FOR_CREDIT_CARD, {
        variables: {
            id: user.token?.user_id
        }
    });
    //check if the transaction was paid
    const [getTransaction] = useLazyQuery(GET_TRANSACTION, {
        onCompleted(data) {
            setPaymentInformation((prev) => ({...prev, payment_succeed: data.getTransaction.paid}));
        }
    });

    //mutations
    //sets the transaction as paid
    const [setTransactionAsPaid] = useMutation(SET_TRANSACTION_AS_PAID);
    //update the quantity of an item
    const [updateProductQuantity] = useMutation(UPDATE_PRODUCT_QUANTITY);
    const [createTransaction] = useMutation(CREATE_TRANSACTION, {
        onCompleted(data) { 
          //if created a new one, set the new transaction id to the redux state
          setTransactionId(data.createTransaction.id);
        }
    });

    

    //when the user is connecting, fetch his cart information
    useEffect(() => {
        if (user.fetch_info && user.token && transaction_id) {
            dontFetch();
            getCartProducts({
                variables: {
                    user_id: user.token.user_id,
                    transaction_id: transaction_id
                }
            });
            getWishlistProducts({
                variables: {
                    userId: user.token.user_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token, transaction_id]);

    useEffect(() => {
        if(transaction_id) {
            getTransaction({
                variables: {
                    id: transaction_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction_id]);

    //wait for the user to connect
    useEffect(() => {
        if (user.token && !transaction_id) {
            //get the address of the user
            getAddress({
                variables: {
                    userId: user.token.user_id
                }
            });

            //get the transaction of the user when he is connecting
            getTransactionId({
                variables: {
                    user_id: user.token.user_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token, transaction_id]);

    //when all the information that is needed is here, check if the user has an open transaction
    useEffect(() => {
        if (transaction_data && address_data) {
            if (transaction_data.getTransactionId) { //if the user already has an open transaction, get it
                setTransactionId(transaction_data.getTransactionId);
            }
            else { //if not, create a new one
                //format today
                const formatted_now = formatDate();

                createTransaction({
                    variables: {
                        user_id: user.token?.user_id,
                        address: address_data.getUser.address,
                        paid: false,
                        ordering_time: formatted_now
                    }
                });

                window.location.reload(); //refresh
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction_data, address_data]);

    //sets the delivery price
    useEffect(() => {
        //add delivery price by distance later
        setPaymentInformation((prev) => ({...prev, delivery: delivery_ground_price}));
    }, [])

    //change the total with every change in one of the fields
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
        type type = {
            product_id: string,
            amount: number
        }

        //sums for each product in the cart his amount
        let temp_cart: type[] = [];
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
        window.location.reload(); //refresh
    }

    //updates the products arrays quantities
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

    //checks if the user has a credit card
    useEffect(() => {
        if(credit_data) {
            setHasCreditCard(credit_data.checkForCreditCard);
        }
    }, [credit_data]);

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
                        cart.map((product, i) => {
                            return (
                                <CartProductDisplay
                                    item_id={product.item_id}
                                    product_id={product.product_id}
                                    amount={product.amount}
                                    size={product.size}
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