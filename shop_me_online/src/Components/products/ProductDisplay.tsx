import React from "react";
import "./Products.css"

//images
import img from "../../Images/j1.png"

//interface
import {Product as MyProps} from "../../App"

export const ProductDisplay: React.FC<MyProps> = ({id, name, price, quantity, categories}) => {

    return(
        <div className="Product_container">
            <img src={img} alt={name} className="img product_img" />
            <div className="product_details">
                <p className="product_name">{name}</p>
                <p className="product_quantity">Left: {quantity}</p>
            </div>
            <p className="product_price">{price}$</p>
        </div>
    )
}