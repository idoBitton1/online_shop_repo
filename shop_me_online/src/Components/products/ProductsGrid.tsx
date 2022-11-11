import React from "react";
import "./Products.css"

//components
import { ProductDisplay } from "./ProductDisplay";

export const ProductsGrid = () => {

    return(
        <>
        <div className="products_grid">
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
            <ProductDisplay />
        </div>
        </>
    )
}