import React from "react";
import './Cart.css';

//components
import { Header } from "../Components/Header/Header";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

import { Button } from "@mui/material";
import { CartProductDisplay } from "../Components/products/CartProductDisplay";

const Cart = () => {

    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);

    return (
        <div className="cart_container">
            <Header />

            <h1 style={{ fontFamily: "Arial" }}> Your Cart </h1>

            <div className="cart_context">
                <div className="cart_items">
                    {
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
                            )
                        })
                    }
                </div>

                <div>
                    <p>Summary</p>
                    <p>Subtotal</p>
                    <p>Total</p>
                    <Button>PAy</Button>
                </div>
            </div>
        </div>
    )
}

export default Cart;