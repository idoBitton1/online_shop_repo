import React from "react";
import "./Products.css"

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//components
import { ProductDisplay } from "./ProductDisplay";

export const ProductsGrid = () => {

    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    return (
        <div className="products_grid">
            {
                products.filtered_products.map((product, i) => {

                    return (
                        <ProductDisplay
                            key={i}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            quantity={product.quantity}
                            category={product.category === undefined ? "" : product.category}
                            img_location={product.img_location} />
                    )
                })
            }
        </div>
    )
}