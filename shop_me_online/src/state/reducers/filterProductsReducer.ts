import { Product } from "../../Pages/Home";
import { FilterProductsActions } from "../actions";
import { FilterProductsActionType } from "../action_types"

let initial_state: Product[] = [];

const reducer = (state: Product[] = initial_state, action: FilterProductsActions) => {
    switch (action.type) {
        case FilterProductsActionType.RESET:
            return action.payload;
        case FilterProductsActionType.FILTER:
            return state.filter((product) => {
                return (
                    (action.payload.category === "any_category" ? true : product.category.includes(action.payload.category)) &&
                    (action.payload.color === "any_color" ? true : product.category.includes(action.payload.color)) &&
                    (action.payload.season === "any_season" ? true : product.category.includes(action.payload.season))
                );
            });
        case FilterProductsActionType.UPDATE_SUPPLY:
            {
                let index_of_current_product = -1;
                index_of_current_product = state.findIndex((product) => product.id === action.payload.id);

                const prev_product = state[index_of_current_product];
                const product = {
                    id: prev_product.id,
                    name: prev_product.name,
                    price: prev_product.price,
                    quantity: prev_product.quantity - action.payload.amount,
                    category: prev_product.category,
                    img_location: prev_product.img_location
                }

                const temp = [...state];
                temp[index_of_current_product] = product;

                return [...temp];
            }
        default:
            return state;
    }
}

export default reducer;