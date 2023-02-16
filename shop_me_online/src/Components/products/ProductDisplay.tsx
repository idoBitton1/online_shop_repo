import React, { useState } from "react";
import "./Products.css";

//components
import { OrderProduct } from "./OrderProduct";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//interface
import { Product } from "../../Pages/Home";

//images
import img from "../../Images/j1.png"

export const ProductDisplay: React.FC<Product> = ({ id, name, price, quantity, category, img_location }) => {
    //states
    const [open_dialog, setOpenDialog] = useState<boolean>(false);

    //redux states
    const user = useSelector((redux_state: ReduxState) => redux_state.user);

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
                user.token?.is_manager
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