import { Dispatch } from "redux";
import { Product } from "../../App"
import { Filters } from "../../Components/Header/NavigationBar";
import { UpdateSupplyProps } from "../actions";
import { Action } from "../actions";
import { FilterProductsActionType } from "../action_types";

export const resetFilterProducts = (products: Product[]) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: FilterProductsActionType.RESET,
            payload: products
        });
    }
}

export const filterFilterProducts = (filters: Filters) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: FilterProductsActionType.FILTER,
            payload: filters
        });
    }
}

export const updateSupply = (data: UpdateSupplyProps) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: FilterProductsActionType.UPDATE_SUPPLY,
            payload: data
        });
    }
}