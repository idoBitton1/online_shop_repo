import { Dispatch } from "redux";

//filtered_products
import { Product } from "../../Pages/Home";
import { Filters } from "../../Components/Header/NavigationBar";
import { UpdateSupplyProps } from "../actions";
import { FilterProductsActions } from "../actions";
import { FilterProductsActionType } from "../action_types";

//cart
import { Cart } from "../../Pages/Home";
import { CartActions } from "../actions";
import { CartActionType } from "../action_types";

//is_connected
import { IsConnectedActions } from "../actions";
import { IsConnectedActionType } from "../action_types";

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
export const addProductToCart = (product: Cart) => {
    return (dispatch: Dispatch<CartActions>) => {
        dispatch({
            type: CartActionType.ADD_PRODUCT,
            payload: product
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

//is_connected functions
export const connect = () => {
    return (dispatch: Dispatch<IsConnectedActions>) => {
        dispatch({
            type: IsConnectedActionType.CONNECT
        });
    }
}

export const disconnect = () => {
    return (dispatch: Dispatch<IsConnectedActions>) => {
        dispatch({
            type: IsConnectedActionType.DISCONNECT
        });
    }
}