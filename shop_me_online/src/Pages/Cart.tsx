import React, { useEffect, useState } from "react";
import './Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation } from "@apollo/client"
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

//icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export interface PaymentProps {
    sum_of_products: number,
    delivery: number,
    total: number,
    has_credit_card: boolean,
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
        has_credit_card: false,
        payment_succeed: false
    });
    const [error, setError] = useState<string>("");

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
    const [checkForCreditCard] = useLazyQuery(CHECK_FOR_CREDIT_CARD, {
        onCompleted(data) {
            setPaymentInformation((prev) => ({...prev, has_credit_card: data.checkForCreditCard}));
        }
    })

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
            checkForCreditCard({
                variables: {
                    id: user.token.user_id
                }
            })
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

    const handlePayClick = () => {
        //check if the user has a credit card
        if(!payment_information.has_credit_card) { //if not
            setError("you need to set a credit card before buying");
            return;
        }

        //set all the products in the cart to be paid for
        cart.forEach((cart_product) => {
            setPaid(cart_product.transaction_id);

            setProductAsPaid({
                variables: {
                    transactionId: cart_product.transaction_id
                }
            })
        });

        setPaymentInformation((prev) => {
            return {
                ...prev,
                payment_succeed: true,
                sum_of_products: 0,
                delivery: 0
            }
        });
    }

    useEffect(() => {
        console.log(payment_information.has_credit_card)
    }, [payment_information.has_credit_card])

    return (
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
                        
                        <Button onClick={handlePayClick}
                            variant="contained"
                            fullWidth>
                            Pay
                        </Button>    

                        <Typography
                        marginTop={2}
                        fontFamily={"Rubik"}
                        color={"red"}>
                            {error ? error : ""}
                        </Typography>
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
    )
}

export default Cart;