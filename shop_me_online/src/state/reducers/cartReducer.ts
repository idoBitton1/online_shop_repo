import { CartProduct } from "../../Pages/Home";
import { CartActions } from "../actions";
import { CartActionType } from "../action_types"

const initial_state: CartProduct[] = [];

const reducer = (state: CartProduct[] = initial_state, action: CartActions) => {
    switch (action.type) {
        case CartActionType.SET:
            return action.payload;
        case CartActionType.ADD_PRODUCT:
            return [...state, action.payload];
        case CartActionType.REMOVE:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.transaction_id === action.payload);

                return [...state.slice(0, index_of_current_product), ...state.slice(index_of_current_product + 1)];
            }
        case CartActionType.SET_PAID:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.transaction_id === action.payload);

                const product = {
                    ...state[index_of_current_product],
                    __typename: 'Users_products',
                    paid: true
                }

                let temp = [...state];
                temp[index_of_current_product] = product;

                return [...temp];
            }
        case CartActionType.SET_NOT_PAID:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.transaction_id === action.payload);

                let temp = state;
                temp[index_of_current_product].paid = false;

                return [...temp];
            }
        case CartActionType.CHANGE_QUANTITY:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.transaction_id === action.payload.transaction_id);

                const product = {
                    ...state[index_of_current_product],
                    __typename: 'Users_products',
                    amount: action.payload.new_value
                }

                let temp = [...state];
                temp[index_of_current_product] = product;

                return [...temp];
            }
        case CartActionType.CHANGE_SIZE:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.transaction_id === action.payload.transaction_id);

                const product = {
                    ...state[index_of_current_product],
                    __typename: 'Users_products',
                    size: action.payload.new_value
                }

                let temp = [...state];
                temp[index_of_current_product] = product;

                return [...temp];
            }
        default:
            return state;
    }
}

export default reducer;