import React, { useState } from "react";
import './ManageProducts.css';

//components
import { Header } from "../Components/Header/Header";
import { ProductsGrid } from "../Components/products/ProductsGrid";
import { NavigationBar } from "../Components/Header/NavigationBar";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";
import { AddProductDialog } from "../Components/products/AddProductDialog";

const ManageProducts = () => {
    //states
    const [is_open, setOpen] = useState<boolean>(false);

    //redux states
    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    const toggleAddProductDialog = () => {
        setOpen((prev) => !prev);
    }

    return (
        <>
        <div className="manage_products_container">
            <Header />

            <div>
            <h1 className="headline"> Manage products </h1>     

            <button className="add_button" 
            onClick={toggleAddProductDialog}>
                Add Product
            </button>    
            </div>       

            <div className="manage_products_context">
                <NavigationBar
                    products={products.products}
                />

                <ProductsGrid to_manage_product={true} />
            </div>
        </div>

        <AddProductDialog 
        is_open={is_open}
        toggleDialog={toggleAddProductDialog}
        />
        </>
    );
}

export default ManageProducts;