import React from "react";
import './ShipOrders.css';

//components
import { Header } from "../Components/Header/Header";

const ShipOrders = () => {

    return (
        <div className="ship_orders_container">
            <Header />

            <h1 className="headline"> Ship Orders </h1>

            <div className="ship_orders_context">
                <h2 style={{ fontFamily: "Rubik" }}>Select transactions to ship:</h2>
            </div>
        </div>
    );
}

export default ShipOrders;