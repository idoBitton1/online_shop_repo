import { combineReducers } from "redux"
import filterProductsReducer from "./filterProductsReducer"
import cartReducer from "./cartReducer"

const reducers = combineReducers({
    filter_products: filterProductsReducer,
    cart: cartReducer
});

export default reducers;

export type ReduxState = ReturnType<typeof reducers>;