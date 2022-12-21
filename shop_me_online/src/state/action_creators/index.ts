import { Dispatch } from "redux";

//filtered_products
import { Product } from "../../Pages/Home";
import { Filters } from "../../Components/Header/NavigationBar";
import { UpdateSupplyProps } from "../actions";
import { FilterProductsActions } from "../actions";
import { FilterProductsActionType } from "../action_types";

//cart
import { CartProduct } from "../../Pages/Home";
import { CartActions } from "../actions";
import { CartActionType } from "../action_types";

//user
import { UserActions } from "../actions";
import { UserActionType } from "../action_types";

//filtered_products functions
export const resetFilterProducts = (products: Product[]) => {
    return (dispatch: Dispatch<FilterProductsActions>) => {
        dispatch({
            type: FilterProductsActionType.RESET,
            payload: products
        });
    }
}

export const filterFilterProducts = (filters: Filters) => {
    return (dispatch: Dispatch<FilterProductsActions>) => {
        dispatch({
            type: FilterProductsActionType.FILTER,
            payload: filters
        });
    }
}

export const updateSupply = (data: UpdateSupplyProps) => {
    return (dispatch: Dispatch<FilterProductsActions>) => {
        dispatch({
            type: FilterProductsActionType.UPDATE_SUPPLY,
            payload: data
        });
    }
}

//cart functions
export const resetCart = (products: CartProduct[]) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.RESET,
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