import { combineReducers } from "redux";

import ProductsReducer from "./ProductsReducer";
import cartReducer from "./cartReducer";
import userReducer from "./userReducer";
import wishlistReducer from "./wishlistReducer";
import transactionReducer from "./transactionReducer";
import awsReducer from "./awsReducer";

const reducers = combineReducers({
    products: ProductsReducer,
    cart: cartReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    transaction_id: transactionReducer,
    aws_s3: awsReducer
});

export default reducers;

export type ReduxState = ReturnType<typeof reducers>;