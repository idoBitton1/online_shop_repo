import React, { useEffect, useState } from "react";
import './Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { GET_USER_CART_PRODUCTS, GET_USER_WISHLIST, CHECK_FOR_CREDIT_CARD } from "../Queries/Queries";
import { SET_PRODUCT_AS_PAID } from "../Queries/Mutations";

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
import { display } from "@mui/system";

export interface PaymentProps {
    sum_of_products: number,
    delivery: number,
    total: number,
    payment_succeed: boolean
}

const Cart = () => {
    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);
    const wishlist = useSelector((redux_state: ReduxState) => redux_state.wishlist);

    const delivery_ground_price = 15;
    const [payment_information, setPaymentInformation] = useState<PaymentProps>({
        sum_of_products: 0,
        delivery: 0,
        total: 0,
        payment_succeed: false
    });
    const [has_credit_card, setHasCreditCard] = useState<boolean>(false);
    const [open_credit_card, setOpenCreditCard] = useState<boolean>(false);
    const [open_confirm, setOpenConfirm] = useState<boolean>(false);

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
    })

    //sets the product as paid
    const [setProductAsPaid] = useMutation(SET_PRODUCT_AS_PAID);

    const dispatch = useDispatch();
    const { setCart, dontFetch, setPaid, setWishlist } = bindActionCreators(actionsCreators, dispatch);

    //when the user is connecting, fetch his cart information
    useEffect(() => {
        if (user.fetch_info && user.token) {
            dontFetch();
            getCartProducts({
                variables: {
                    userId: user.token.user_id
                }
            });
            getWishlistProducts({
                variables: {
                    userId: user.token.user_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token]);

    useEffect(() => {
        //add delivery price by distance later
        setPaymentInformation((prev) => ({...prev, delivery: delivery_ground_price}));
    }, [])

    //change the total with every change in one of the fields
    useEffect(() => {
        setPaymentInformation((prev) => ({...prev, total: payment_information.sum_of_products + payment_information.delivery}));
    }, [payment_information.sum_of_products, payment_information.delivery]);

    const handlePayment = () => {
        //set all the products in the cart to paid
        cart.forEach((cart_product) => {
            //set paid locally
            setPaid(cart_product.transaction_id);

            //set paid in the db
            setProductAsPaid({
                variables: {
                    transactionId: cart_product.transaction_id
                }
            })
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

            <h1 style={{ fontFamily: "Arial" }}> Your Cart </h1>

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
                        //render all the products in the cart
                        cart.filter((cart_product) => cart_product.paid === false).map((product, i) => {
                            return (
                                <CartProductDisplay
                                    product_id={product.product_id}
                                    transaction_id={product.transaction_id}
                                    address={product.address}
                                    quantity={product.amount}
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