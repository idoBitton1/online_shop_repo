import { Product } from "../../Pages/Home";
import { ProductsActions } from "../actions";
import { ProductsActionType } from "../action_types";

interface ProductsInfo {
    products: Product[],
    filtered_products: Product[],
    fetch_info: boolean
}

let initial_state: ProductsInfo = {
    products: [],
    filtered_products: [],
    fetch_info: true
};

const reducer = (state:ProductsInfo = initial_state, action: ProductsActions) => {
    switch (action.type) {
        case ProductsActionType.SET_FILTERED_PRODUCTS:
            return {
                ...state,
                filtered_products: action.payload
            }
        case ProductsActionType.SET_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }
        case ProductsActionType.FILTER:
            return {
                ...state,
                filtered_products: state.filtered_products.filter((product) => {
                    return (
                        (action.payload.category === "any_category" ? true : product.category.includes(action.payload.category)) &&
                        (action.payload.color === "any_color" ? true : product.category.includes(action.payload.color)) &&
                        (action.payload.season === "any_season" ? true : product.category.includes(action.payload.season))
                    );
                })
            }
        case ProductsActionType.UPDATE_SUPPLY:
            {
                //update the filtered products
                let index_of_current_product_filtered = -1;
                index_of_current_product_filtered = state.filtered_products.findIndex((product) => product.id === action.payload.id);

                const prev_product_filtered = state.filtered_products[index_of_current_product_filtered];
                const product_filtered = {
                    ...prev_product_filtered,
                    quantity: prev_product_filtered.quantity - action.payload.amount
                }

                const temp_filtered = [...state.filtered_products];
                temp_filtered[index_of_current_product_filtered] = product_filtered;

                //update the regular products
                let index_of_current_product = -1;
                index_of_current_product = state.products.findIndex((product) => product.id === action.payload.id);

                const prev_product = state.products[index_of_current_product];
                const product = {
                    ...prev_product,
                    quantity: prev_product.quantity - action.payload.amount
                }

                const temp = [...state.products];
                temp[index_of_current_product] = product;

                return {
                    ...state,
                    products: [...temp],
                    filtered_products: [...temp_filtered]
                };
            }
        case ProductsActionType.DONT_FETCH_PRODUCTS:
            return {
                ...state,
                fetch_info: false
            }
        default:
            return state;
    }
}

export default reducer;