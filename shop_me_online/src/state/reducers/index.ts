import { combineReducers } from "redux"

import filterProductsReducer from "./filterProductsReducer"
import cartReducer from "./cartReducer"
import isConnectedReducer from "./isConnectedReducer"

const reducers = combineReducers({
    filtered_products: filterProductsReducer,
    cart: cartReducer,
    is_connected: isConnectedReducer
});

export default reducers;

export type ReduxState = ReturnType<typeof reducers>;