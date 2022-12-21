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
                let index_of_current_product = -1;
                index_of_current_product = state.filtered_products.findIndex((product) => product.id === action.payload.id);

                const prev_product = state.filtered_products[index_of_current_product];
                const product = {
                    id: prev_product.id,
                    name: prev_product.name,
                    price: prev_product.price,
                    quantity: prev_product.quantity - action.payload.amount,
                    category: prev_product.category,
                    img_location: prev_product.img_location
                }

                const temp = [...state.filtered_products];
                temp[index_of_current_product] = product;

                return {
                    ...state,
                    filtered_products: [...temp]
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