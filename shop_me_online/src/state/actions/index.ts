//filter_product
import { Product } from "../../App";
import { Filters } from "../../Components/Header/NavigationBar";
import { FilterProductsActionType } from "../action_types";
//cart
import { CartActionType } from "../action_types";
import { Cart } from "../../App";

interface ResetAction{
    type: FilterProductsActionType.RESET,
    payload: Product[]
}

interface FilterAction{
    type: FilterProductsActionType.FILTER,
    payload: Filters
}

export interface UpdateSupplyProps{
    id: string,
    amount: number
}

interface UpdateSupplyAction{
    type: FilterProductsActionType.UPDATE_SUPPLY,
    payload: UpdateSupplyProps
}

export type FilterProductsActions = ResetAction | FilterAction | UpdateSupplyAction;

interface AddProductAction{
    type: CartActionType.ADD_PRODUCT,
    payload: Cart
}

interface RemoveFromCartAction{
    type: CartActionType.REMOVE,
    payload: string
}

export type CartActions = AddProductAction | RemoveFromCartAction;