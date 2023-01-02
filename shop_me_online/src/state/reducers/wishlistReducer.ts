import { Wishlist } from "../../Pages/Home";
import { WishlistActions } from "../actions";
import { WishlistActionType } from "../action_types"

const initial_state: Wishlist[] = [];

const reducer = (state: Wishlist[] = initial_state, action: WishlistActions) => {
    switch(action.type) {
        case WishlistActionType.SET_WISHLIST:
            return action.payload;
        case WishlistActionType.ADD_TO_WISHLIST:
            return [...state, action.payload];
        case WishlistActionType.REMOVE_FROM_WISHLIST:
            {
                let index_of_current_product = -1;

                index_of_current_product = state.findIndex((product) => product.user_id === action.payload.user_id && product.product_id === action.payload.product_id);

                return [...state.slice(0, index_of_current_product), ...state.slice(index_of_current_product + 1)];
            }
        default:
            return state;
    }
}

export default reducer;