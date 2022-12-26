import React, { useEffect, useState } from "react";
import './Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation } from "@apollo/client"
import { GET_USER_CART_PRODUCTS } from "../Queries/Queries";
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


const Cart = () => {

    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);

    const [sum_of_products, setSumOfProducts] = useState<number>(0);
    const [delivery, setDelivery] = useState<number>(0);
    const delivery_ground_price = 15;
    const [total, setTotal] = useState<number>(0);

    const [getCartProducts, { data: cart_data }] = useLazyQuery(GET_USER_CART_PRODUCTS);

    const [setProductAsPaid] = useMutation(SET_PRODUCT_AS_PAID);

    const dispatch = useDispatch();
    const { setCart, dontFetch, setPaid } = bindActionCreators(actionsCreators, dispatch);

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
    }, [user.token]);

    //set the information in the cart redux state
    useEffect(() => {
        if (cart_data) {
            setCart(cart_data.getUserCartProducts);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart_data]);

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

        setSumOfProducts(0);
        setDelivery(0);
    }

    useEffect(() => {
        console.log(cart);
    }, [cart])

    return (
        <div className="cart_container">
            <Header />

            <h1 style={{ fontFamily: "Arial" }}> Your Cart </h1>

            <div className="cart_context">
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