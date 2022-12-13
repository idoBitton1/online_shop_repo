import { combineReducers } from "redux"

import filterProductsReducer from "./filterProductsReducer"
import cartReducer from "./cartReducer"
import userReducer from "./userReducer"

const reducers = combineReducers({
    filtered_products: filterProductsReducer,
    cart: cartReducer,
    user: userReducer
});

export default reducers;

export type ReduxState = ReturnType<typeof reducers>;