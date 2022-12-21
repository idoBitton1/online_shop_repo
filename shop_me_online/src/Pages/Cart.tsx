import React, { useEffect, useState } from "react";
import './Cart.css';

//Apollo and graphql
import { useLazyQuery } from "@apollo/client"
import { GET_USER_CART_PRODUCTS } from "../Queries/Queries";

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


const Cart = () => {

    const [sum_of_products, setSumOfProducts] = useState<number>(0);
    const [delivery, setDelivery] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);

    const [getCartProducts, { data: cart_data }] = useLazyQuery(GET_USER_CART_PRODUCTS);

    const dispatch = useDispatch();
    const { setCart, dontFetch } = bindActionCreators(actionsCreators, dispatch);

    //when the user is connecting, fetch his cart information
    useEffect(() => {
        if (user.fetch_info && user.token) {
            dontFetch();
            getCartProducts({
                variables: {
                    userId: user.token.user_id
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token])

    //set the information in the cart redux state
    useEffect(() => {
        if (cart_data) {
            setCart(cart_data.getUserCartProducts);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart_data]);

    return (
        <div className="cart_container">
            <Header />

            <h1 style={{ fontFamily: "Arial" }}> Your Cart </h1>

            <div className="cart_context">
                <div className="summary_container">
                    <p style={{ fontWeight: "bold" }}>Summary</p>

                    <div className="summary_field">
                        <p>Subtotal</p>
                        <p>{sum_of_products}</p>
                    </div>
                    <div className="summary_field">
                        <p>Delivery</p>
                        <p>{delivery}</p>
                    </div>
                    <div className="total_field">
                        <p>Total</p>
                        <p>{total}</p>
                    </div>
                    
                    <Button
                        variant="contained"
                        fullWidth>
                        Pay
                    </Button>
                </div>

                <div className="cart_items">
                    {
                        //render all the products in the cart
                        cart.map((product, i) => {
                            return (
                                <CartProductDisplay
                                    product_id={product.product_id}
                                    transaction_id={product.transaction_id}
                                    address={product.address}
                                    amount={product.amount}
                                    size={product.size}
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