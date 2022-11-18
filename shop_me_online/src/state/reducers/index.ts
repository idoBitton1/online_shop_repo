import { combineReducers } from "redux"
import filterProductsReducer from "./filterProductsReducer"

const reducers = combineReducers({
    filter_products: filterProductsReducer
});

export default reducers;

export type ReduxState = ReturnType<typeof reducers>;