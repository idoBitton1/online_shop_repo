import { combineReducers } from "redux";

import ProductsReducer from "./ProductsReducer";
import cartReducer from "./cartReducer";
import userReducer from "./userReducer";
import wishlistReducer from "./wishlistReducer";

const reducers = combineReducers({
    products: ProductsReducer,
    cart: cartReducer,
    user: userReducer,
    wishlist: wishlistReducer
});

export default reducers;

export type ReduxState = ReturnType<typeof reducers>;