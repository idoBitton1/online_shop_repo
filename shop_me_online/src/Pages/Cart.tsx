import React, { useEffect, useState } from "react";
import './Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation } from "@apollo/client"
import { GET_USER_CART_PRODUCTS, GET_USER_WISHLIST } from "../Queries/Queries";
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
import { Button } from "@mui/material";

//icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


const Cart = () => {

    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);
    const wishlist = useSelector((redux_state: ReduxState) => redux_state.wishlist);

    const [sum_of_products, setSumOfProducts] = useState<number>(0);
    const [delivery, setDelivery] = useState<number>(0);
    const delivery_ground_price = 15;
    const [total, setTotal] = useState<number>(0);
    const [payment_succeed, setPaymentSucceed] = useState<boolean>(false);

    const [getCartProducts, { data: cart_data }] = useLazyQuery(GET_USER_CART_PRODUCTS);
    const [getWishlistProducts, { data: wishlist_data }] = useLazyQuery(GET_USER_WISHLIST);

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

    //set the information in the cart redux state
    useEffect(() => {
        if (cart_data) {
            if(cart.length === 0) { //if the cart is empty when entering the cart page
                setCart(cart_data.getUserCartProducts);
            }
            else {
                window.location.reload(); //refresh the page, in case the fetch will not bring all the info at the first time
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart_data]);

    useEffect(() => {
        if(wishlist_data) {
            if(wishlist.length === 0) {
                setWishlist(wishlist_data.getUserWishlist);
            }
            else {
                window.location.reload();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlist_data])

    useEffect(() => {
        //add delivery price by distance later
        setDelivery(delivery_ground_price);
    }, [])

    //change the total with every change in one of the fields
    useEffect(() => {
        setTotal(sum_of_products + delivery);
    }, [sum_of_products, delivery]);

    const handlePayClick = () => {
        //set all the products in the cart to be paid for
        cart.forEach((cart_product) => {
            setPaid(cart_product.transaction_id);

            setProductAsPaid({
                variables: {
                    transactionId: cart_product.transaction_id
                }
            })
        });

        setPaymentSucceed(true);
        setSumOfProducts(0);
        setDelivery(0);
    }

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
                            <p>{sum_of_products}$</p>
                        </div>
                        <div className="summary_field">
                            <p>Delivery</p>
                            <p>{delivery}$</p>
                        </div>
                        <div className="total_field">
                            <p>Total</p>
                            <p>{total}$</p>
                        </div>
                        
                        <Button onClick={handlePayClick}
                            variant="contained"
                            fullWidth>
                            Pay
                        </Button>    
                    </div>

                    {
                        payment_succeed
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
                                    amount={product.amount}
                                    size={product.size}
                                    setSumOfProducts={setSumOfProducts}
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