import { combineReducers } from "redux"

import ProductsReducer from "./ProductsReducer"
import cartReducer from "./cartReducer"
import userReducer from "./userReducer"

const reducers = combineReducers({
    products: ProductsReducer,
    cart: cartReducer,
    user: userReducer
});

export default reducers;

export type ReduxState = ReturnType<typeof reducers>;