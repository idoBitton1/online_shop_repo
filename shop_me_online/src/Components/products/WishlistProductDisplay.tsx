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

interface MyProps {
    user_id: string,
    product_id: string
}

export const WishlistProductDisplay: React.FC<MyProps> = ({user_id, product_id}) => {

    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    const dispatch = useDispatch();
    const { removeFromWishlist } = bindActionCreators(actionsCreators, dispatch);

    const [product_name, setProductName] = useState<string>("");
    const [product_price, setProductPrice] = useState<number>(0);
    const [product_quantity, setProductQuantity] = useState<number>(0);

    const [ getProduct, { data: product_data }]  = useLazyQuery(GET_PRODUCT);

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
        if(product_data){
            setProductName(product_data.getProduct.name);

            setProductPrice(product_data.getProduct.price);

            if(products.products.length !== 0) {
                let index = products.products.findIndex((product) => product.id === product_id);
                setProductQuantity(products.products[index].quantity); //a more accurate quantity
            }
            else
                setProductQuantity(product_data.getProduct.quantity);// plan B
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
    
    return (
        <div className="wishlist_product_display">
            <div className="product_info">
                <img src={img} alt="product" className="cart_product_img" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p className="cart_product_name">{product_name}</p>
                    <p>price for each: {product_price}$</p>
                    <p>Left in stock: {product_quantity}</p>
                </div>
            </div>

            <div style={{ marginLeft: 300 }}>
                <button className="delete_btn">
                    <CloseIcon onClick={handleDeleteClick} />
                </button>
            </div>
        </div>
    )
}