//filter_product
import { Product } from "../../Pages/Home";
import { Filters } from "../../Components/Header/NavigationBar";
import { FilterProductsActionType } from "../action_types";
//cart
import { CartActionType } from "../action_types";
import { CartProduct } from "../../Pages/Home";
//is_connected
import { IsConnectedActionType } from "../action_types"

interface ResetAction {
    type: FilterProductsActionType.RESET,
    payload: Product[]
}

interface FilterAction {
    type: FilterProductsActionType.FILTER,
    payload: Filters
}

export interface UpdateSupplyProps {
    id: string,
    amount: number
}

interface UpdateSupplyAction {
    type: FilterProductsActionType.UPDATE_SUPPLY,
    payload: UpdateSupplyProps
}

export type FilterProductsActions = ResetAction | FilterAction | UpdateSupplyAction;

interface AddProductAction {
    type: CartActionType.ADD_PRODUCT,
    payload: CartProduct
}

interface SetPaidAction {
    type: CartActionType.SET_PAID,
    payload: string
}

interface SetNotPaidAction {
    type: CartActionType.SET_NOT_PAID,
    payload: string
}

interface RemoveFromCartAction {
    type: CartActionType.REMOVE,
    payload: string
}

export type CartActions = AddProductAction | RemoveFromCartAction | SetPaidAction | SetNotPaidAction;

interface ConnectAction {
    type: IsConnectedActionType.CONNECT
}
interface DisconnectAction {
    type: IsConnectedActionType.DISCONNECT
}

export type IsConnectedActions = ConnectAction | DisconnectAction;