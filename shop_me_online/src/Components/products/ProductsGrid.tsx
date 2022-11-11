import React from "react";
import "./Products.css"

//components
import { ProductDisplay } from "./ProductDisplay";
import { CatergoriesBar } from "./CategoriesBar";

export const ProductsGrid = () => {

    return(
        <>
        <CatergoriesBar />
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