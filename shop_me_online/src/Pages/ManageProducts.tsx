import React from "react";
import './ManageProducts.css';

//components
import { Header } from "../Components/Header/Header";
import { ProductsGrid } from "../Components/products/ProductsGrid";
import { NavigationBar } from "../Components/Header/NavigationBar";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

const ManageProducts = () => {
    //redux states
    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    const handleAddProductClick = () => {
        
    }

    return (
        <div className="manage_products_container">
            <Header />

            <div className="add_button_container">
                <button className="add_button">
                    Add Product
                </button>
            </div> 

            <h1 className="headline"> Manage products </h1>                

            <div className="manage_products_context">
                <NavigationBar
                    products={products.products}
                />

                <ProductsGrid to_manage_product={true} />
            </div>
        </div>
    );
}

export default ManageProducts;