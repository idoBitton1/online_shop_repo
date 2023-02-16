import React from "react";
import './ManageProducts.css';

import { Header } from "../Components/Header/Header";

const ManageProducts = () => {

    return (
        <div className="manage_products_container">
            <Header />

            <h1 className="headline"> Manage products </h1>

            <div className="manage_products_context">
                
            </div>
        </div>
    );
}

export default ManageProducts;