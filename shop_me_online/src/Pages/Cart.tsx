import React from "react";
import './Cart.css';

//components
import { Header } from "../Components/Header/Header";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

//images
import img from "../Images/j1.png"
import { Button } from "@mui/material";

const Cart = () => {

    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);

    // address: string,
    // amount: number,
    // size: string,
    // ordering_time: string,
    // paid: boolean

    return (
        <div className="cart_container">
            <Header />

            <h1 style={{ fontFamily: "Arial" }}> Your Cart </h1>

            <div className="cart_context">
                <div className="cart_items">
                    <div className="cart_product_display">
                        <div style={{ display: "flex" }}>
                            <img src={img} alt="product" className="cart_product_img" />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <p>Air Jordan 1 Lucky Green</p>
                                <p>150$</p>
                                <p>Left in stock: 149</p>
                            </div>
                        </div>

                        <div style={{ width: 200, border: "1px solid black" }}>
                            <p>Size</p>
                            <p>41 US change</p>
                            <p>Quantity</p>
                            <p>1 change</p>
                            <p>Ship to</p>
                            <p>Bat yam</p>
                        </div>

                        <div>X</div>
                    </div>
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