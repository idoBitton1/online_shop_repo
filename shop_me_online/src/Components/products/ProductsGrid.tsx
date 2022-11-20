import React from "react";
import "./Products.css"

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state"; 

//components
import { ProductDisplay } from "./ProductDisplay";
import { Product } from "../../App";

interface MyProps{
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

export const ProductsGrid: React.FC<MyProps> = ({setProducts}) => {

    const filtered_products = useSelector((redux_state: ReduxState) => redux_state.filter_products);

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
                        categories={product.categories}
                        setProducts={setProducts}/>
                    )
                })
            }
        </div>
    )
}