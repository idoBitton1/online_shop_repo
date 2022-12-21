import React, { useEffect, useState } from "react";
import '../../Pages/Cart.css';

//Apollo and graphql
import { useLazyQuery } from "@apollo/client"
import { GET_PRODUCT } from "../../Queries/Queries";

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

    const [product_name, setProductName] = useState<string>("");
    const [product_price, setProductPrice] = useState<number>(0);
    const [product_quantity, setProductQuantity] = useState<number>(0);

    const [ getProduct, { data: product_data }]  = useLazyQuery(GET_PRODUCT);

    //fetch if the product_id is not null
    useEffect(() => {
        if(product_id){
            getProduct({
                variables: {
                    id: product_id
                }
            })
        }
    }, [product_id])

    //set the information in the variables to display it
    useEffect(() => {
        if(product_data){
            setProductName(product_data.getProduct.name);
            setProductPrice(product_data.getProduct.price);
            setProductQuantity(product_data.getProduct.quantity);
        }
    }, [product_data])

    return (
        <div className="cart_product_display">
            <div className="product_info">
                <img src={img} alt="product" className="cart_product_img" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p className="cart_product_name">{product_name}</p>
                    <p>{product_price}$</p>
                    <p>Left in stock: {product_quantity}</p>
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