import { Product } from "../../App";
import { Action } from "../actions";
import { FilterProductsActionType } from "../action_types"

const initial_state: Product[] = [];

const reducer = (state: Product[] = initial_state, action: Action) => {
    switch(action.type){
        case FilterProductsActionType.RESET:
            return action.payload;
        case FilterProductsActionType.FILTER:
            return state.filter((product) => {
                return (
                (action.payload.category === "any_category" ? true : product.categories.includes(action.payload.category)) &&
                (action.payload.color === "any_color" ? true : product.categories.includes(action.payload.color)) &&
                (action.payload.season === "any_season" ? true : product.categories.includes(action.payload.season))
                );
            });
        case FilterProductsActionType.UPDATE_SUPPLY:
            {
                let index_of_current_record = -1;
                index_of_current_record = state.findIndex((product) => product.id === action.payload.id);
                
                const prev_product = state[index_of_current_record];
                const product = {
                    id: prev_product.id,
                    name: prev_product.name,
                    price: prev_product.price,
                    quantity: prev_product.quantity - action.payload.amount,
                    categories: prev_product.categories
                }
                
                const temp = [...state];
                temp[index_of_current_record] = product;

                return [...temp];
            }
        default:
            return state;
    }
}

export default reducer;