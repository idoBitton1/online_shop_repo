import { Dispatch } from "redux";

//filtered_products
import { Product } from "../../Pages/Home";
import { Filters } from "../../Components/Header/NavigationBar";
import { UpdateSupplyProps } from "../actions";
import { ProductsActions } from "../actions";
import { ProductsActionType } from "../action_types";

//cart
import { CartProduct } from "../../Pages/Home";
import { CartActions } from "../actions";
import { CartActionType } from "../action_types";

//user
import { UserActions } from "../actions";
import { UserActionType } from "../action_types";

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

export const dont_fetch_products = () => {
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

export const setPaid = (product_id: string) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.SET_PAID,
            payload: product_id
        });
    }
}

export const setNotPaid = (product_id: string) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.SET_NOT_PAID,
            payload: product_id
        });
    }
}

export const removeFromCart = (product_id: string) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.REMOVE,
            payload: product_id
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