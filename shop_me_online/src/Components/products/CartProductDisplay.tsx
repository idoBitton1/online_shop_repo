import React, { useEffect, useState } from "react";
import '../../Pages/Cart.css';

//Apollo and graphql
import { useMutation, useQuery } from "@apollo/client"
import { GET_PRODUCT } from "../../Queries/Queries";
import { REMOVE_PRODUCT_FROM_CART, UPDATE_CART_PRODUCT_AMOUNT,
         UPDATE_CART_PRODUCT_SIZE } from "../../Queries/Mutations";

//redux
import { useDispatch, useSelector } from 'react-redux';
import { actionsCreators, ReduxState } from "../../state";
import { bindActionCreators } from 'redux';

//material-ui
import { Select, FormControl, MenuItem, SelectChangeEvent } from "@mui/material";

//icons
import CloseIcon from '@mui/icons-material/Close';

//interface
import { PaymentProps } from "../../Pages/Cart";
 
//images
import default_image from "../../Images/default.png";

interface MyProps {
    item_id: string,
    product_id: string,
    amount: number,
    size: string,
    img_location: string,
    img_uploaded: boolean,
    setPaymentInformation: React.Dispatch<React.SetStateAction<PaymentProps>>
}

interface ProductProperties {
    name: string,
    price: number,
    quantity: number,
    category: string
}

interface ChangeProperties {
    size: boolean,
    quantity: boolean
}

export const CartProductDisplay: React.FC<MyProps> = ({item_id, product_id, amount, size, img_location, img_uploaded, setPaymentInformation}) => {
    //states
    const [image, setImage] = React.useState<string>(default_image);
    const [err_text, setErrText] = useState<string>("");
    const [order_amount, setOrderAmount] = useState<number>(amount);
    const [order_size, setOrderSize] = useState<string>(size);
    const [change_properties, setChange] = useState<ChangeProperties>({ size: false, quantity: false });  
    const [product_info, setOrderedProduct] = useState<ProductProperties>({
        name: "",
        price: 0,
        quantity: 0,
        category: ""
    });

    //redux states
    const products = useSelector((redux_state: ReduxState) => redux_state.products);
    const aws = useSelector((redux_state: ReduxState) => redux_state.aws_s3);

    //redux actions
    const dispatch = useDispatch();
    const { removeFromCart, changeQuantity, changeSize } = bindActionCreators(actionsCreators, dispatch);    

    //queries
    useQuery(GET_PRODUCT, {
        variables: {
            id: product_id
        },
        onCompleted(data) {
            //set the product's infornation
            setOrderedProduct((prev) => {
                return { ...prev, 
                    name: data.getProduct.name,
                    price: data.getProduct.price,
                    category: data.getProduct.category,
                    quantity: data.getProduct.quantity
                }
            });

            //add the price of this item to the total amount
            setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products + order_amount * data.getProduct.price}));
        },
    });

    //mutations
    const [removeProductFromCart] = useMutation(REMOVE_PRODUCT_FROM_CART);
    const [updateCartProductAmount] = useMutation(UPDATE_CART_PRODUCT_AMOUNT);
    const [updateCartProductSize] = useMutation(UPDATE_CART_PRODUCT_SIZE);
    

    //fetch the product image from the s3
    React.useEffect(() => {
        if(img_uploaded) {
            setImage(aws.s3.getSignedUrl('getObject', {
                Bucket: aws.bucket_name,
                Key: img_location,
                Expires: aws.signed_url_expire_seconds
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [img_uploaded]) // upadtes when changing 

    //update the total amount, if changed
    useEffect(() => {
        //add the price of this item to the total amount
        setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products + order_amount * product_info.price}));
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_amount]);

    //remove the item from the cart
    const handleDeleteClick = () => {       
        removeProductFromCart({
            variables: {
                item_id: item_id
            }
        });

        removeFromCart(item_id);

        //remove the item's price from the total amount
        setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products - order_amount * product_info.price}));
    }

    const handleChangeQuantity = () => {
        setChange((prev) => {
            return {
                ...prev,
                quantity: !prev.quantity
            }
        });
    }

    const handleQuantitySelect = (event: SelectChangeEvent<number>) => {
        const products_quantity = event.target.value as number;

        //check if the new quantity is available in stock
        let index_of_product = products.filtered_products.findIndex((product) => product.id === product_id);
        if (products.filtered_products[index_of_product].quantity < products_quantity) {
            setErrText("not enough in stock");
            return;
        }

        //remove the item's price from the total amount, and it will re-add the new amount in the useEffect
        setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products - order_amount * product_info.price}));

        //update the state
        setOrderAmount(products_quantity);

        //update the cart
        changeQuantity({ item_id: item_id, new_value: products_quantity });
    
        //update the db
        updateCartProductAmount({
            variables: {
                item_id: item_id,
                new_amount: products_quantity
            }
        });

        //close the change
        setChange((prev) => {
            return {
                ...prev,
                quantity: false
            }
        });
    }

    const handleChangeSize = () => {
        setChange((prev) => {
            return {
                ...prev,
                size: !prev.size
            }
        });
    }

    const handleSizeSelect = (event: SelectChangeEvent<string>) => {
        const new_size = event.target.value as string;
        
        //update the state
        setOrderSize(new_size);

        //update the cart
        changeSize({ item_id: item_id, new_value: new_size });

        //update db
        updateCartProductSize({
            variables: {
                item_id: item_id,
                new_size: new_size
            }
        });

        //close the change
        setChange((prev) => {
            return {
                ...prev,
                size: false
            }
        });
    }

    return (
        <div className="cart_product_display">
            <div className="product_info">
                <img src={image} alt="product" className="cart_product_img" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p className="cart_product_name">{product_info.name}</p>
                    <p>price for each: {product_info.price}$</p>
                    <p>Left in stock: {product_info.quantity}</p>
                </div>
            </div>

            <div className="order_info">
                <p className="order_info_headline">Size</p>
                <div style={{display: "flex"}}>
                    {
                        change_properties.size
                        ?
                        <FormControl variant="standard" sx={{ marginTop: 0.5 }}>
                        <Select
                            id="size_select"
                            label="size"
                            value={order_size}
                            onChange={handleSizeSelect}
                            >
                            <MenuItem value={product_info.category.includes("shoes") ? "37" : "XXS"}>{product_info.category.includes("shoes") ? "37" : "XXS"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "38" : "XS"}>{product_info.category.includes("shoes") ? "38" : "XS"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "39" : "S"}>{product_info.category.includes("shoes") ? "39" : "S"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "40" : "M"}>{product_info.category.includes("shoes") ? "40" : "M"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "41" : "L"}>{product_info.category.includes("shoes") ? "41" : "L"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "42" : "XL"}>{product_info.category.includes("shoes") ? "42" : "XL"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "43" : "XXL"}>{product_info.category.includes("shoes") ? "43" : "XXL"}</MenuItem>
                        </Select>
                        </FormControl>
                        :
                        <p>{size} US</p>
                    }
                    <p className="change" onClick={handleChangeSize}>change</p>
                </div>
                <p className="order_info_headline">Quantity</p>
                <div style={{display: "flex"}}>
                    {
                        change_properties.quantity
                        ?
                        <FormControl variant="standard" sx={{marginTop: 0.5}}>
                        <Select
                            id="amount_select"
                            value={order_amount}
                            onChange={handleQuantitySelect}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                        </Select>
                        </FormControl>
                        :
                        <p>{order_amount}</p>
                    }
                    <p className="change" onClick={handleChangeQuantity}>change</p>
                    <p style={{color: "red"}}>{err_text ? err_text : ""}</p>
                </div>
            </div>

            <div style={{ alignSelf: "flex-start" }}>
                <button className="delete_btn">
                    <CloseIcon onClick={handleDeleteClick} />
                </button>
            </div>
        </div>
    );
}