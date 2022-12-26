import React, { useEffect, useState } from "react";
import '../../Pages/Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation } from "@apollo/client"
import { GET_PRODUCT } from "../../Queries/Queries";
import { DELETE_PRODUCT_FROM_CART } from "../../Queries/Mutations";

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../../state";
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

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
    setSumOfProducts: React.Dispatch<React.SetStateAction<number>>
}

export const CartProductDisplay: React.FC<MyProps> = ({product_id, transaction_id, address, amount, size, setSumOfProducts}) => {

    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    const dispatch = useDispatch();
    const { removeFromCart } = bindActionCreators(actionsCreators, dispatch);

    const [product_name, setProductName] = useState<string>("");
    const [product_price, setProductPrice] = useState<number>(0);
    const [product_quantity, setProductQuantity] = useState<number>(0);

    const [ getProduct, { data: product_data }]  = useLazyQuery(GET_PRODUCT);

    const [deleteProductFromCart] = useMutation(DELETE_PRODUCT_FROM_CART);

    //fetch if the product_id is not null
    useEffect(() => {
        if(product_id){
            getProduct({
                variables: {
                    id: product_id
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product_id]);

    //set the information in the variables to display it
    useEffect(() => {
        if(product_data){
            setProductName(product_data.getProduct.name);

            setProductPrice(product_data.getProduct.price);

            //add the price of this item to the total amount
            setSumOfProducts((prev) => prev + amount * product_data.getProduct.price);

            if(products.products.length !== 0) {
                let index = products.products.findIndex((product) => product.id === product_id);
                setProductQuantity(products.products[index].quantity); //a more accurate quantity
            }
            else
                setProductQuantity(product_data.getProduct.quantity);// plan B
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product_data]);

    //remove the item from the cart
    const handleDeleteClick = () => {       
        deleteProductFromCart({
            variables: {
                transactionId: transaction_id
            }
        });

        removeFromCart(transaction_id);

        //remove the item's price from the total amount
        setSumOfProducts((prev) => prev - amount * product_price);
    }

    return (
        <div className="cart_product_display">
            <div className="product_info">
                <img src={img} alt="product" className="cart_product_img" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p className="cart_product_name">{product_name}</p>
                    <p>price for each: {product_price}$</p>
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
                <button className="delete_btn">
                    <CloseIcon onClick={handleDeleteClick} />
                </button>
            </div>
        </div>
    )
}