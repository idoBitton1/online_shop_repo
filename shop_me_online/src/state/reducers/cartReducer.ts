import { Cart } from "../../Pages/Home";
import { CartActions } from "../actions";
import { CartActionType } from "../action_types"

const initial_state: Cart[] = [];

const reducer = (state: Cart[] = initial_state, action: CartActions) => {
    switch(action.type)
    {
        case CartActionType.ADD_PRODUCT:
            return [...state, action.payload];
        case CartActionType.REMOVE:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.product_id === action.payload);

                return [...state.slice(0,index_of_current_product), ...state.slice(index_of_current_product + 1)];
            }
        default:
            return state;
    }
}

export default reducer;