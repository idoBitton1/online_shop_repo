import React, { useEffect, useState } from "react";
import '../../Pages/Cart.css';

//Apollo and graphql
import { useLazyQuery, useMutation } from "@apollo/client"
import { GET_PRODUCT, GET_ALL_PRODUCTS } from "../../Queries/Queries";
import { DELETE_PRODUCT_FROM_CART, UPDATE_CART_PRODUCT_AMOUNT,
         UPDATE_CART_PRODUCT_SIZE } from "../../Queries/Mutations";

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../../state";
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//material-ui
import { Select, FormControl, MenuItem, SelectChangeEvent } from "@mui/material";

//icons
import CloseIcon from '@mui/icons-material/Close';

//interface
import { PaymentProps } from "../../Pages/Cart";
 
//images
import img from "../../Images/j1.png";

interface MyProps {
    product_id: string,
    transaction_id: string,
    address: string,
    quantity: number,
    size: string,
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

export const CartProductDisplay: React.FC<MyProps> = ({product_id, transaction_id, address, quantity, size, setPaymentInformation}) => {

    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    const [product_info, setOrderedProduct] = useState<ProductProperties>({
        name: "",
        price: 0,
        quantity: 0,
        category: ""
    });
    const [order_quantity, setOrderQuantity] = useState<number>(quantity);
    const [order_size, setOrderSize] = useState<string>(size);
    const [change_properties, setChange] = useState<ChangeProperties>({ size: false, quantity: false });
    const [err_text, setErrText] = useState<string>("");

    const [ getProducts, { data: products_data }] = useLazyQuery(GET_ALL_PRODUCTS);

    const [ getProduct, { data: product_data }]  = useLazyQuery(GET_PRODUCT);

    const [deleteProductFromCart] = useMutation(DELETE_PRODUCT_FROM_CART);
    const [updateCartProductQuantity] = useMutation(UPDATE_CART_PRODUCT_AMOUNT);
    const [updateCartProductSize] = useMutation(UPDATE_CART_PRODUCT_SIZE);

    const dispatch = useDispatch();
    const { removeFromCart, changeQuantity, changeSize, setFilterProducts, setProducts, dontFetchProducts } = bindActionCreators(actionsCreators, dispatch);

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
            setOrderedProduct((prev) => {
                return { ...prev, name: product_data.getProduct.name }
            });

            setOrderedProduct((prev) => {
                return { ...prev, price: product_data.getProduct.price }
            });

            //add the price of this item to the total amount
            setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products + order_quantity * product_data.getProduct.price}));

            if(products.products.length !== 0) {
                let index = products.products.findIndex((product) => product.id === product_id);
                setOrderedProduct((prev) => {
                    return { ...prev, quantity: products.products[index].quantity }
                });
            }
            else {
                setOrderedProduct((prev) => {
                    return { ...prev, quantity: product_data.getProduct.quantity } //plan B
                });
            }

            setOrderedProduct((prev) => {
                return { ...prev, category: product_data.getProduct.category }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product_data]);

    //update the total amount, if changed
    useEffect(() => {
        //add the price of this item to the total amount
        setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products + order_quantity * product_info.price}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_quantity]);

    //if the products array is empty, fetch it
    useEffect(() => {
        if(products.products.length === 0) {
            getProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products.products])

    //fetch the products, to get the exact quantity of a product, in case of a refresh
    useEffect(() => {
        if(products_data && products.fetch_info) {
          dontFetchProducts();
          setProducts(products_data.getAllProducts);
          setFilterProducts(products_data.getAllProducts);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [products_data]);

    //remove the item from the cart
    const handleDeleteClick = () => {       
        deleteProductFromCart({
            variables: {
                transactionId: transaction_id
            }
        });

        removeFromCart(transaction_id);

        //remove the item's price from the total amount
        setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products - order_quantity * product_info.price}));
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
        setPaymentInformation((prev) => ({...prev, sum_of_products:  prev.sum_of_products - order_quantity * product_info.price}));

        //update the state
        setOrderQuantity(products_quantity);

        //update the cart
        changeQuantity({ transaction_id: transaction_id, new_value: products_quantity });
    
        //update the db
        updateCartProductQuantity({
            variables: {
                transactionId: transaction_id,
                newQuantity: products_quantity
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
        changeSize({ transaction_id: transaction_id, new_value: new_size });

        //update db
        updateCartProductSize({
            variables: {
                transactionId: transaction_id,
                newSize: new_size
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
                <img src={img} alt="product" className="cart_product_img" />
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
                            <MenuItem value={product_info.category.includes("shoes") ? "41" : "XS"}>{product_info.category.includes("shoes") ? "41" : "XS"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "42" : "S"}>{product_info.category.includes("shoes") ? "42" : "S"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "43" : "M"}>{product_info.category.includes("shoes") ? "43" : "M"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "44" : "L"}>{product_info.category.includes("shoes") ? "44" : "L"}</MenuItem>
                            <MenuItem value={product_info.category.includes("shoes") ? "45" : "XL"}>{product_info.category.includes("shoes") ? "45" : "XL"}</MenuItem>
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
                            value={order_quantity}
                            onChange={handleQuantitySelect}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                        </Select>
                        </FormControl>
                        :
                        <p>{order_quantity}</p>
                    }
                    <p className="change" onClick={handleChangeQuantity}>change</p>
                    <p style={{color: "red"}}>{err_text ? err_text : ""}</p>
                </div>
                <p className="order_info_headline">Ship to</p>
                <p>{address}</p>
            </div>

            <div style={{ marginLeft: 300 }}>
                <button className="delete_btn">
                    <CloseIcon onClick={handleDeleteClick} />
                </button>
            </div>
        </div>
    );
}