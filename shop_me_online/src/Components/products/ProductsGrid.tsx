import React from "react";
import "./Products.css"

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//components
import { ProductDisplay } from "./ProductDisplay";

//interface
import { Product } from "../../Pages/Home";

interface MyProps {
    products: Product[],
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

export const ProductsGrid: React.FC<MyProps> = ({ products, setProducts }) => {

    const filtered_products = useSelector((redux_state: ReduxState) => redux_state.filtered_products);

    return (
        <div className="products_grid">
            {
                filtered_products.map((product, i) => {

                    return (
                        <ProductDisplay
                            key={i}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            quantity={product.quantity}
                            category={product.category === undefined ? "" : product.category}
                            img_location={product.img_location}
                            products={products}
                            setProducts={setProducts} />
                    )
                })
            }
        </div>
    )
}