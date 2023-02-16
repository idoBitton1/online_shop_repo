import React, { useEffect, useState } from "react";
import '../../Pages/Wishlist.css';

//Apollo and graphql
import { useLazyQuery, useMutation } from "@apollo/client"
import { GET_PRODUCT } from "../../Queries/Queries";
import { DELETE_PRODUCT_FROM_WISHLIST } from "../../Queries/Mutations";

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
import { OrderProduct } from "./OrderProductDialog";

//interface
import { Product } from "../../Pages/Home";
import { Button } from "@mui/material";

interface MyProps {
    user_id: string,
    product_id: string
}

export const WishlistProductDisplay: React.FC<MyProps> = ({user_id, product_id}) => {
    //redux states
    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    //redux actions
    const dispatch = useDispatch();
    const { removeFromWishlist } = bindActionCreators(actionsCreators, dispatch);

    //states
    const [open_dialog, SetOpenDialog] = useState<boolean>(false);
    const [product_info, setProductInfo] = useState<Product>({
        id: product_id,
        name: "",
        price: 0,
        quantity: 0,
        category: "",
        img_location: ""
    });

    //queries
    const [ getProduct, { data: product_data }]  = useLazyQuery(GET_PRODUCT);

    //mutations
    const [deleteProductFromWishlist] = useMutation(DELETE_PRODUCT_FROM_WISHLIST);



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
        if(product_data) {
            setProductInfo((prev) => {
                return {
                    id: prev.id,
                    name: product_data.getProduct.name,
                    price: product_data.getProduct.price,
                    quantity: product_data.getProduct.quantity,
                    category: product_data.getProduct.category,
                    img_location: product_data.getProduct.img_location
                }
            })

            if(products.products.length !== 0) {
                let index = products.products.findIndex((product) => product.id === product_id);
                //a more accurate quantity
                setProductInfo((prev) => ({...prev, quantity: products.products[index].quantity}));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product_data]);

    //remove the item from the wishlist
    const handleDeleteClick = () => {
        deleteProductFromWishlist({
            variables: {
                userId: user_id,
                productId: product_id
            }
        });

        removeFromWishlist({
            user_id: user_id,
            product_id: product_id
        });
    }

    const toggleDialog = () => {
        SetOpenDialog((prev) => !prev);
    }
    
    return (
        <>
        <div className="wishlist_product_display">
            <div className="product_info">
                <img src={img} alt="product" className="cart_product_img" />
                <div style={{ display: "flex", flexDirection: "column",  }}>
                    <p className="cart_product_name">{product_info.name}</p>
                    <p>price for each: {product_info.price}$</p>
                    <p>Left in stock: {product_info.quantity}</p>
                    
                    <Button variant="contained"
                    onClick={toggleDialog}
                    >
                        Buy now
                    </Button>
                </div>
            </div>

            <div style={{ marginLeft: 300 }}>
                <button className="delete_btn">
                    <CloseIcon onClick={handleDeleteClick} />
                </button>
            </div>
        </div>

        <OrderProduct 
        is_open={open_dialog}
        toggleDialog={toggleDialog}
        id={product_id}
        name={product_info.name}
        price={product_info.price}
        quantity={product_info.quantity}
        category={product_info.category}
        img_location={product_info.img_location}
        />
        </>
    )
}