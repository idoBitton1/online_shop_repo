import React, { useEffect } from "react";
import './Wishlist.css';

//Apollo and graphql
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { GET_USER_WISHLIST, GET_USER_CART_PRODUCTS, GET_TRANSACTION_ID, GET_USER, GET_ALL_PRODUCTS } from "../Queries/Queries";

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../state";
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

//components
import { Header } from "../Components/Header/Header";
import { WishlistProductDisplay } from "../Components/products/WishlistProductDisplay";

//function
import { formatDate } from "./Home";
import { CREATE_TRANSACTION } from "../Queries/Mutations";

const Wishlist = () => {
    //redux states
    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const wishlist = useSelector((redux_state: ReduxState) => redux_state.wishlist);
    const products = useSelector((redux_state: ReduxState) => redux_state.products);
    const transaction_id = useSelector((redux_state: ReduxState) => redux_state.transaction_id);

    //redux actions
    const dispatch = useDispatch();
    const { setWishlist, setTransactionId, setProducts, setFilterProducts } = bindActionCreators(actionsCreators, dispatch);

    //queries
    useQuery(GET_ALL_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted(data) {
          setProducts(data.getAllProducts);
          setFilterProducts(data.getAllProducts);
        },
    });
    const [getTransactionId, { data: transaction_data }] = useLazyQuery(GET_TRANSACTION_ID);
    const [getAddress, { data: address_data }] = useLazyQuery(GET_USER);

    //when the info comes back, set the information in the wishlist redux state
    const [getWishlistProducts] = useLazyQuery(GET_USER_WISHLIST, {
        fetchPolicy: "network-only",
        onCompleted(data) {
            setWishlist(data.getUserWishlist);
        }
    });

    //mutations
    const [createTransaction] = useMutation(CREATE_TRANSACTION, {
        onCompleted(data) { 
          //if created a new one, set the new transaction id to the redux state
          setTransactionId(data.createTransaction.id);
        }
    });


    //when the user is connecting, fetch his cart information
    useEffect(() => {
        if (user.token) {
            getWishlistProducts({
                variables: {
                    userId: user.token.user_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token]);

    //wait for the user to connect
    useEffect(() => {
        if (user.token && !transaction_id) {
            //get the address of the user
            getAddress({
                variables: {
                    userId: user.token.user_id
                }
            });

            //get the transaction of the user when he is connecting
            getTransactionId({
                variables: {
                    user_id: user.token.user_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token, transaction_id]);

    //when all the information that is needed is here, check if the user has an open transaction
    useEffect(() => {
        if (transaction_data && address_data) {
            if (transaction_data.getTransactionId) { //if the user already has an open transaction, get it
                setTransactionId(transaction_data.getTransactionId);
            }
            else { //if not, create a new one
                //format today
                const formatted_now = formatDate();

                createTransaction({
                    variables: {
                        user_id: user.token?.user_id,
                        address: address_data.getUser.address,
                        paid: false,
                        ordering_time: formatted_now
                    }
                });

                window.location.reload(); //refresh
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction_data, address_data]);

    return (
        <div className="wishlist_container">
            <Header />

            <h1 className="headline"> Wishlist </h1>

            <div className="wishlist_context">
                {
                    wishlist.map((wishlist_product, i) => {
                        const product_index = products.products.findIndex((product) => product.id === wishlist_product.product_id);
                        let img_location = products.products[product_index].img_location;
                        let img_uploaded = products.products[product_index].img_uploaded;

                        
                        return(
                            <WishlistProductDisplay 
                                user_id={wishlist_product.user_id}
                                product_id={wishlist_product.product_id}
                                img_location={img_location}
                                img_uploaded={img_uploaded}
                                key={i}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Wishlist;