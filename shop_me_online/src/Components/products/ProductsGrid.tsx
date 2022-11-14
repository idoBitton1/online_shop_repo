import React from "react";
import "./Products.css"

//components
import { ProductDisplay } from "./ProductDisplay";

//interface
import {Product} from "../../App"

interface MyProps{
    products: Product[],
    filtered_products: Product[]
}

export const ProductsGrid: React.FC<MyProps> = ({products, filtered_products}) => {

    return(
        <div className="products_grid">
            {
                filtered_products.map((product) => {
                    return (
                        <ProductDisplay
                        key={product.id}
                        id={product.id} 
                        name={product.name} 
                        price={product.price}
                        quantity={product.quantity}
                        categories={product.categories}/>
                    )
                })
            }
        </div>
    )
}