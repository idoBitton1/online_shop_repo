import { Product } from "../../App";
import { Filters } from "../../Components/Header/NavigationBar";
import { FilterProductsActionType } from "../action_types"

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

export type Action = ResetAction | FilterAction | UpdateSupplyAction;