import { Dispatch } from "redux";

//filtered_products
import { Product } from "../../App"
import { Filters } from "../../Components/Header/NavigationBar";
import { UpdateSupplyProps } from "../actions";
import { FilterProductsActions } from "../actions";
import { FilterProductsActionType } from "../action_types";

//cart
import { Cart } from "../../App"
import { CartActions } from "../actions";
import { CartActionType } from "../action_types";

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