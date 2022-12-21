import React, { useState } from "react";
import "./Products.css";
import * as uuid from 'uuid';

//Apollo and graphql
import { useMutation } from "@apollo/client"
import { UPDATE_PRODUCT_QUANTITY, ADD_PRODUCT_TO_CART } from "../../Queries/Mutations";

//redux
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState, actionsCreators } from "../../state";
import { bindActionCreators } from 'redux';

//material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Button, FormControl, InputLabel, MenuItem, Select, Typography,
        SelectChangeEvent} from "@mui/material";

//interface
import { Product } from "../../Pages/Home";

//icons
import FavoriteIcon from '@mui/icons-material/Favorite';

//images
import img from "../../Images/j1.png"

export const ProductDisplay: React.FC<Product> = ({ id, name, price, quantity, category, img_location }) => {

    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    const user = useSelector((redux_state: ReduxState) => redux_state.user);

    const [size, setSize] = useState<string>("");
    const [amount, setAmount] = useState<number>(1);
    const [err_text, setErrText] = useState<string>("");

    const [open_dialog, setOpenDialog] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { updateSupply, addProductToCart, setProducts } = bindActionCreators(actionsCreators, dispatch);

    const [updateProductQuantity] = useMutation(UPDATE_PRODUCT_QUANTITY);
    const [addProductToCartMutation] = useMutation(ADD_PRODUCT_TO_CART);

    const toggleDialog = () => {

        setSize("");
        setAmount(1);
        setErrText("");

        setOpenDialog((prev) => !prev);
    }

    const handleAmountSelect = (event: SelectChangeEvent<number>) => {
        const products_amount = event.target.value as number;

        setAmount(products_amount);
    }

    const handleAddToCart = async () => {
        //if no user is connected, cant buy
        if (!user.token) {
            setErrText("log in to buy");
            return;
        }

        let index_of_product = products.filtered_products.findIndex((product) => product.id === id);
        if (products.filtered_products[index_of_product].quantity < amount) {
            setErrText("not enough in stock");
            return;
        }

        //checks that size isn't empty
        if (size === "") {
            setErrText("please choose size");
            return;
        }

        //update both arrays
        updateSupply({
            id: id,
            amount: amount
        });

        try {
            await updateProductQuantity({
                variables: {
                    id: id,
                    newQuantity: quantity - amount
                }
            });
        } catch (err: any) {
            console.error(err.message);
        }

        //update the amount of the product that was bought
        var index_of_current_product = -1;

        //find the index of the product in the array
        index_of_current_product = products.products.findIndex((product) => product.id === id);

        //re create the product
        const product = {
            __typename: 'Product',
            id: id,
            name: name,
            price: price,
            quantity: quantity - amount,
            category: category,
            img_location: img_location
        }

        //change him with the old one
        const temp = [...products.products];
        temp[index_of_current_product] = product;

        //change the array
        setProducts([...temp]);

        //format today
        const formatted_now = formatDate();

        const my_transaction_id = uuid.v4();

        //adds the product to the cart
        addProductToCart({
            user_id: user.token.user_id,
            product_id: id,
            size: size,
            amount: amount,
            address: user.token.address,
            paid: false,
            ordering_time: formatted_now,
            transaction_id: my_transaction_id
        });

        try {
            await addProductToCartMutation({
                variables: {
                    userId: user.token.user_id,
                    productId: id,
                    size: size,
                    amount: amount,
                    address: user.token.address,
                    paid: false,
                    orderingTime: formatted_now,
                    transactionId: my_transaction_id
                }
            });
        } catch (err: any) {
            console.error(err.message);
        }

        toggleDialog();
    }

    const formatDate = (): string => {
        const today: Date = new Date();
        const yyyy: number = today.getFullYear();
        let mm: number = today.getMonth() + 1; // Months start at 0
        let dd: number = today.getDate();

        let ddd: string = `${dd}`;
        let mmm: string = `${mm}`;
        if (dd < 10) ddd = '0' + dd;
        if (mm < 10) mmm = '0' + mm;

        const formatted_today: string = yyyy + '/' + mmm + '/' + ddd;
        return formatted_today;
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

            {<Dialog open={open_dialog} onClose={toggleDialog} fullWidth>
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
                        <img src={img} alt={name} className="buying_img" />
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
                                        <MenuItem value={category.includes("shoes") ? "41" : "XS"}>{category.includes("shoes") ? "41" : "XS"}</MenuItem>
                                        <MenuItem value={category.includes("shoes") ? "42" : "S"}>{category.includes("shoes") ? "42" : "S"}</MenuItem>
                                        <MenuItem value={category.includes("shoes") ? "43" : "M"}>{category.includes("shoes") ? "43" : "M"}</MenuItem>
                                        <MenuItem value={category.includes("shoes") ? "44" : "L"}>{category.includes("shoes") ? "44" : "L"}</MenuItem>
                                        <MenuItem value={category.includes("shoes") ? "45" : "XL"}>{category.includes("shoes") ? "45" : "XL"}</MenuItem>
                                    </Select>
                                </FormControl>
                                :
                                <></>
                            }

                            <div style={{ display: "flex" }}>
                                <Button variant="contained"
                                    onClick={handleAddToCart}
                                    sx={{ textTransform: "none", marginRight: 1, fontWeight: "bold" }}>
                                    Add To Cart
                                </Button>
                                <Button variant="outlined" endIcon={<FavoriteIcon />}
                                    sx={{ textTransform: "none", fontWeight: "bold" }}>
                                    Wishlist
                                </Button>
                            </div>
                            <p>{err_text ? `*${err_text}` : ""}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>}
        </>
    )
}