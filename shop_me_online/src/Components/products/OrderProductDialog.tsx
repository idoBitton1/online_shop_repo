import React, { useState } from "react";
import "./Products.css";
import * as uuid from 'uuid';

//Apollo and graphql
import { useMutation } from "@apollo/client"
import { ADD_PRODUCT_TO_CART, ADD_TO_WISHLIST } from "../../Queries/Mutations";

//redux
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState, actionsCreators } from "../../state";
import { bindActionCreators } from 'redux';

//material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Button, FormControl, InputLabel, MenuItem, Select, Typography, SelectChangeEvent} from "@mui/material";

//icons
import FavoriteIcon from '@mui/icons-material/Favorite';

//images
import default_image from "../../Images/default.png";

interface MyProps {
    is_open: boolean,
    toggleDialog: () => void,
    id: string,
    name: string,
    quantity: number,
    price: number,
    category: string,
    img_location: string,
    img_uploaded: boolean
}

export const OrderProduct: React.FC<MyProps> = ({is_open, toggleDialog, id, name, quantity, price, category, img_location, img_uploaded}) => {
    //states
    const [size, setSize] = useState<string>("");
    const [amount, setAmount] = useState<number>(1);
    const [err_text, setErrText] = useState<string>("");
    const [image, setImage] = React.useState<string>(default_image);
    
    //redux states
    const products = useSelector((redux_state: ReduxState) => redux_state.products);
    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const transaction_id = useSelector((redux_state: ReduxState) => redux_state.transaction_id);
    const aws = useSelector((redux_state: ReduxState) => redux_state.aws_s3);

    //redux actions
    const dispatch = useDispatch();
    const { addProductToCart, addToWishlist } = bindActionCreators(actionsCreators, dispatch);
    
    //mutations
    const [addProductToCartMutation] = useMutation(ADD_PRODUCT_TO_CART);
    const [addProductToWishlist, { error }] = useMutation(ADD_TO_WISHLIST);


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

    //the function of the amount select
    const handleAmountSelect = (event: SelectChangeEvent<number>) => {
        const products_amount = event.target.value as number;

        setAmount(products_amount);
    }

    //the function of the add the cart button click
    const handleAddToCart = () => {
        //if no user is connected, cant buy
        if (!user.token) {
            setErrText("log in to buy");
            return;
        }

        //checks that size isn't empty
        if (size === "") {
            setErrText("please choose size");
            return;
        }

        //check in stock
        let index_of_product = products.products.findIndex((product) => product.id === id);
        if (products.products[index_of_product].quantity < amount) {
            setErrText("not enough in stock");
            return;
        }
        

        //create a uuid for the item id
        const my_item_id = uuid.v4();

        //adds the product to the cart
        addProductToCart({
            item_id: my_item_id,
            transaction_id: transaction_id,
            product_id: id,
            size: size,
            amount: amount        
        });

        //update db
        try {
            addProductToCartMutation({
                variables: {
                    item_id: my_item_id,
                    transaction_id: transaction_id,
                    product_id: id,
                    size: size,
                    amount: amount             
                }
            });
        } catch (err: any) {
            console.error(err.message);
        }


        //close the dialog
        toggleDialog();
    }

    //add to wishlist click
    const handleWishlist = async() => {
        //if no user is connected, cant add to wishlist
        if (!user.token) {
            setErrText("log in to add to wishlist");
            return;
        }

        try {
            await addProductToWishlist({
                variables: {
                    userId: user.token.user_id,
                    productId: id
                }
            });
        } catch (err: any) {
            console.log(err.message);
            setErrText(error ? error.message : "");
            return;
        }

        //adds the product to the wishlist
        addToWishlist({
            user_id: user.token.user_id,
            product_id: id
        });

        toggleDialog();
    }

    const beforeToggleDialog = () => {
        setSize("");
        setAmount(1);
        setErrText("");

        toggleDialog();
    }

    const doNothing = () => {};

    return (
        <Dialog open={is_open} onClose={beforeToggleDialog} fullWidth>
            <DialogTitle>
                <Typography
                    fontSize={25}
                    borderBottom={1}
                    borderColor={"lightgray"}
                    gutterBottom>
                    {name}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <div className="buying_container">
                    <img src={image} alt={name} className="buying_img" />
                    <div className="buying_info">
                        <p>Left: {quantity}</p>

                        <p>${price}</p>

                        <div style={{ display: "flex" }}>
                            <p>amount: </p>
                            <FormControl variant="standard" sx={{ marginLeft: 1, marginTop: 1 }}>
                                <Select
                                    id="amount_select"
                                    value={amount}
                                    onChange={handleAmountSelect}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {!category.includes("bags") ?
                            <FormControl variant="standard" sx={{ marginBottom: 2 }}>
                                <InputLabel>Size</InputLabel>
                                <Select
                                    id="size_select"
                                    label="size"
                                    value={size}
                                    onChange={(event) => setSize(event.target.value as string)}
                                >
                                    <MenuItem value={category.includes("shoes") ? "37" : "XXS"}>{category.includes("shoes") ? "37" : "XXS"}</MenuItem>
                                    <MenuItem value={category.includes("shoes") ? "38" : "XS"}>{category.includes("shoes") ? "38" : "XS"}</MenuItem>
                                    <MenuItem value={category.includes("shoes") ? "39" : "S"}>{category.includes("shoes") ? "39" : "S"}</MenuItem>
                                    <MenuItem value={category.includes("shoes") ? "40" : "M"}>{category.includes("shoes") ? "40" : "M"}</MenuItem>
                                    <MenuItem value={category.includes("shoes") ? "41" : "L"}>{category.includes("shoes") ? "41" : "L"}</MenuItem>
                                    <MenuItem value={category.includes("shoes") ? "42" : "XL"}>{category.includes("shoes") ? "42" : "XL"}</MenuItem>
                                    <MenuItem value={category.includes("shoes") ? "43" : "XXL"}>{category.includes("shoes") ? "43" : "XXL"}</MenuItem>
                                </Select>
                            </FormControl>
                            :
                            <></>
                        }

                        <div style={{ display: "flex" }}>
                            <Button variant="contained"
                                onClick={user.token?.is_manager ? doNothing : handleAddToCart}
                                sx={{ textTransform: "none", marginRight: 1, fontWeight: "bold" }}>
                                Add To Cart
                            </Button>
                            <Button variant="outlined"
                                onClick={user.token?.is_manager ? doNothing : handleWishlist}
                                endIcon={<FavoriteIcon />}
                                sx={{ textTransform: "none", fontWeight: "bold" }}>
                                Wishlist
                            </Button>
                        </div>
                        <p>{err_text ? `*${err_text}` : ""}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}