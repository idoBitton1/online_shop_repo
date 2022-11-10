import React from "react";
import "./Products.css"

import img from "../../Images/j1.png"

export const ProductDisplay = () => {

    return(
        <div className="Product_container">
            <img src={img} alt="j1" className="img product_img" />
            <div className="product_details">
                <p className="product_name">air jordan 1 lucky green</p>
                <p className="product_quantity">Left: 150</p>
            </div>
            <p className="product_price">150$</p>
        </div>
    )
}