import { CartProduct } from "../../Pages/Home";
import { CartActions } from "../actions";
import { CartActionType } from "../action_types"

const initial_state: CartProduct[] = [];

const reducer = (state: CartProduct[] = initial_state, action: CartActions) => {
    switch (action.type) {
        case CartActionType.RESET:
            return action.payload;
        case CartActionType.ADD_PRODUCT:
            return [...state, action.payload];
        case CartActionType.REMOVE:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.product_id === action.payload);

                return [...state.slice(0, index_of_current_product), ...state.slice(index_of_current_product + 1)];
            }
        case CartActionType.SET_PAID:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.product_id === action.payload);

                let temp = state;
                temp[index_of_current_product].paid = true;

                return [...temp];
            }
        case CartActionType.SET_NOT_PAID:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.product_id === action.payload);

                let temp = state;
                temp[index_of_current_product].paid = false;

                return [...temp];
            }
        default:
            return state;
    }
}

export default reducer;