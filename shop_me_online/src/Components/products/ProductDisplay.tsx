import React, { useState } from "react";
import "./Products.css";

//components
import { OrderProduct } from "./OrderProductDialog";

//interface
import { Product } from "../../Pages/Home";

//images
import img from "../../Images/j1.png"

interface MyProps extends Product {
    to_manage_product: boolean
}

export const ProductDisplay: React.FC<MyProps> = ({ id, name, price, quantity, category, img_location, to_manage_product }) => {
    //states
    const [open_dialog, setOpenDialog] = useState<boolean>(false);

    const toggleDialog = () => {
        setOpenDialog((prev) => !prev);
    }

    return (
        <>
            <div className="Product_container" onClick={toggleDialog}>
                <img src={img} alt={name} className="img product_img" />
                <div className="product_details">
                    <p className="product_name">{name}</p>
                    <p className="product_quantity">Left: {quantity}</p>
                </div>
                <div className="product_details">
                    <p className="product_price">{price}$</p>
                    <p className="product_oos">
                        {quantity === 0 ? "*out of stock" : ""}
                    </p>
                </div>
            </div>

            {/* the dialog */}
            {
                to_manage_product
                ?
                <></>
                :
                <OrderProduct 
                is_open={open_dialog}
                toggleDialog={toggleDialog}
                id={id}
                name={name}
                price={price}
                quantity={quantity}
                category={category}
                img_location={img_location}
                />
            }
        </>
    )
}