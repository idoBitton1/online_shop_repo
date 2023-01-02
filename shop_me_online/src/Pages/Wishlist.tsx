import React, { useEffect } from "react";
import './Wishlist.css';

//Apollo and graphql
import { useLazyQuery } from "@apollo/client"
import { GET_USER_WISHLIST, GET_USER_CART_PRODUCTS } from "../Queries/Queries";

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../state";
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

//components
import { Header } from "../Components/Header/Header";
import { WishlistProductDisplay } from "../Components/products/WishlistProductDisplay";

const Wishlist = () => {

    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const wishlist = useSelector((redux_state: ReduxState) => redux_state.wishlist);
    const cart = useSelector((redux_state: ReduxState) => redux_state.cart);

    const [getWishlistProducts, { data: wishlist_data }] = useLazyQuery(GET_USER_WISHLIST);
    const [getCartProducts, { data: cart_data }] = useLazyQuery(GET_USER_CART_PRODUCTS);

    const dispatch = useDispatch();
    const { dontFetch, setWishlist, setCart } = bindActionCreators(actionsCreators, dispatch);

    //when the user is connecting, fetch his cart information
    useEffect(() => {
        if (user.fetch_info && user.token) {
            dontFetch();
            getCartProducts({
                variables: {
                    userId: user.token.user_id
                }
            });
            getWishlistProducts({
                variables: {
                    userId: user.token.user_id
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token]);

    //set the information in the cart redux state
    useEffect(() => {
        if (cart_data) {
            if(cart.length === 0) { //if the cart is empty when entering the cart page
                setCart(cart_data.getUserCartProducts);
            }
            else {
                window.location.reload(); //refresh the page, in case the fetch will not bring all the info at the first time
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart_data]);

    useEffect(() => {
        if(wishlist_data) {
            if(wishlist.length === 0) {
                setWishlist(wishlist_data.getUserWishlist);
            }
            else {
                window.location.reload();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlist_data]);

    return (
        <div className="wishlist_container">
            <Header />

            <h1 style={{ fontFamily: "Arial" }}> Wishlist </h1>

            <div className="wishlist_context">
                {
                    wishlist.map((product, i) => {
                        return(
                            <WishlistProductDisplay 
                                user_id={product.user_id}
                                product_id={product.product_id}
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