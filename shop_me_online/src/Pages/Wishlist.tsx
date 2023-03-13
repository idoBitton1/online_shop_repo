import React, { useEffect } from "react";
import './Wishlist.css';

//Apollo and graphql
import { useLazyQuery, useQuery } from "@apollo/client"
import { GET_USER_WISHLIST, GET_ALL_PRODUCTS } from "../Queries/Queries";

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
    //redux states
    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const wishlist = useSelector((redux_state: ReduxState) => redux_state.wishlist);
    const products = useSelector((redux_state: ReduxState) => redux_state.products);

    //redux actions
    const dispatch = useDispatch();
    const { setWishlist, setProducts, setFilterProducts } = bindActionCreators(actionsCreators, dispatch);

    //queries
    //get all products, because the wishlist products dont hold the same information as the 
    //regular products is holding (such as the price, img_location etc.)
    useQuery(GET_ALL_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted(data) {
          setProducts(data.getAllProducts);
          setFilterProducts(data.getAllProducts);
        },
    });
    //when the info comes back, set the information in the wishlist redux state
    const [getWishlistProducts] = useLazyQuery(GET_USER_WISHLIST, {
        fetchPolicy: "network-only",
        onCompleted(data) {
            setWishlist(data.getUserWishlist);
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