import { Dispatch } from "redux";

//filtered_products
import { Product } from "../../Pages/Home";
import { Filters } from "../../Components/Header/NavigationBar";
import { UpdateSupplyProps, ProductsActions } from "../actions";
import { ProductsActionType } from "../action_types";

//cart
import { CartProduct } from "../../Pages/Home";
import { CartActions, ChangeQuantityProperties, ChangeSizeProperties } from "../actions";
import { CartActionType } from "../action_types";

//user
import { UserActions } from "../actions";
import { UserActionType } from "../action_types";

//wishlist
import { Wishlist } from "../../Pages/Home";
import { WishlistActions } from "../actions";
import { WishlistActionType } from "../action_types";

//filtered_products functions
export const setFilterProducts = (products: Product[]) => {
    return (dispatch: Dispatch<ProductsActions>) => {
        dispatch({
            type: ProductsActionType.SET_FILTERED_PRODUCTS,
            payload: products
        });
    }
}

export const setProducts = (products: Product[]) => {
    return (dispatch: Dispatch<ProductsActions>) => {
        dispatch({
            type: ProductsActionType.SET_PRODUCTS,
            payload: products
        });
    }
}

export const filterFilterProducts = (filters: Filters) => {
    return (dispatch: Dispatch<ProductsActions>) => {
        dispatch({
            type: ProductsActionType.FILTER,
            payload: filters
        });
    }
}

export const updateSupply = (data: UpdateSupplyProps) => {
    return (dispatch: Dispatch<ProductsActions>) => {
        dispatch({
            type: ProductsActionType.UPDATE_SUPPLY,
            payload: data
        });
    }
}

export const dontFetchProducts = () => {
    return (dispatch: Dispatch<ProductsActions>) => {
        dispatch({
            type: ProductsActionType.DONT_FETCH_PRODUCTS
        });
    }
}

//cart functions
export const setCart = (products: CartProduct[]) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.SET,
            payload: products
        });
    }
}

export const addProductToCart = (product: CartProduct) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.ADD_PRODUCT,
            payload: product
        });
    }
}

export const setPaid = (transaction_id: string) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.SET_PAID,
            payload: transaction_id
        });
    }
}

export const setNotPaid = (transaction_id: string) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.SET_NOT_PAID,
            payload: transaction_id
        });
    }
}

export const removeFromCart = (transaction_id: string) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.REMOVE,
            payload: transaction_id
        });
    }
}

export const changeQuantity = (change_properties: ChangeQuantityProperties) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.CHANGE_QUANTITY,
            payload: change_properties
        });
    }
}

export const changeSize = (change_properties: ChangeSizeProperties) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.CHANGE_SIZE,
            payload: change_properties
        });
    }
}

//user
export const login = (token: string) => {
    return (dispatch: Dispatch<UserActions>) => {
        dispatch({
            type: UserActionType.LOGIN,
            payload: token
        });
    }
}

export const logout = () => {
    return (dispatch: Dispatch<UserActions>) => {
        dispatch({
            type: UserActionType.LOGOUT
        });
    }
}

export const dontFetch = () => {
    return (dispatch: Dispatch<UserActions>) => {
        dispatch({
            type: UserActionType.DONT_FETCH
        });
    }
}

//wishlist
export const setWishlist = (products: Wishlist[]) => {
    return (dispatch: Dispatch<WishlistActions>) => {
        dispatch({
            type: WishlistActionType.SET_WISHLIST,
            payload: products
        });
    }
}

export const addToWishlist = (product: Wishlist) => {
    return (dispatch: Dispatch<WishlistActions>) => {
        dispatch({
            type: WishlistActionType.ADD_TO_WISHLIST,
            payload: product
        });
    }
}

export const removeFromWishlist = (ids: Wishlist) => {
    return (dispatch: Dispatch<WishlistActions>) => {
        dispatch({
            type: WishlistActionType.REMOVE_FROM_WISHLIST,
            payload: ids
        });
    }
}