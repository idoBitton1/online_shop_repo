import React from "react";
import '../../Pages/Cart.css';

//icons
import CloseIcon from '@mui/icons-material/Close';

//images
import img from "../../Images/j1.png";

interface MyProps {
    product_id: string,
    transaction_id: string,
    address: string,
    amount: number,
    size: string,
}

export const CartProductDisplay: React.FC<MyProps> = ({product_id, transaction_id, address, amount, size}) => {

    return (
        <div className="cart_product_display">
            <div className="product_info">
                <img src={img} alt="product" className="cart_product_img" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p className="cart_product_name">Air Jordan 1 Lucky Green</p>
                    <p>150$</p>
                    <p>Left in stock: 149</p>
                </div>
            </div>

            <div className="order_info">
                <p className="order_info_headline">Size</p>
                <p>{size} US change</p>
                <p className="order_info_headline">Amount</p>
                <p>{amount} change</p>
                <p className="order_info_headline">Ship to</p>
                <p>{address}</p>
            </div>

            <div style={{ marginLeft: 300 }}>
                <button className="close_btn"><CloseIcon /></button>
            </div>
        </div>
    )
}