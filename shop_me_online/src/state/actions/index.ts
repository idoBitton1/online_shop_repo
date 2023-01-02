//filter_product
import { Product } from "../../Pages/Home";
import { Filters } from "../../Components/Header/NavigationBar";
import { ProductsActionType } from "../action_types";
//cart
import { CartActionType } from "../action_types";
import { CartProduct } from "../../Pages/Home";
//user
import { UserActionType } from "../action_types";
//wishlist
import { WishlistActionType } from "../action_types";
import { Wishlist } from "../../Pages/Home";

export interface UpdateSupplyProps {
    id: string,
    amount: number
}

interface SetFilteredProductsAction {
    type: ProductsActionType.SET_FILTERED_PRODUCTS,
    payload: Product[]
}

interface SetProductsAction {
    type: ProductsActionType.SET_PRODUCTS,
    payload: Product[]
}

interface FilterAction {
    type: ProductsActionType.FILTER,
    payload: Filters
}

interface UpdateSupplyAction {
    type: ProductsActionType.UPDATE_SUPPLY,
    payload: UpdateSupplyProps
}

interface DontFetchProductsAction {
    type: ProductsActionType.DONT_FETCH_PRODUCTS
}

export type ProductsActions = SetFilteredProductsAction | SetProductsAction | FilterAction | UpdateSupplyAction | DontFetchProductsAction;

interface SetCartAction {
    type: CartActionType.SET,
    payload: CartProduct[]
}

interface AddProductAction {
    type: CartActionType.ADD_PRODUCT,
    payload: CartProduct
}

interface SetPaidAction {
    type: CartActionType.SET_PAID,
    payload: string
}

interface SetNotPaidAction {
    type: CartActionType.SET_NOT_PAID,
    payload: string
}

interface RemoveFromCartAction {
    type: CartActionType.REMOVE,
    payload: string
}

export type CartActions = SetCartAction | AddProductAction | RemoveFromCartAction | SetPaidAction | SetNotPaidAction;

interface LoginUserAction {
    type: UserActionType.LOGIN,
    payload: string
}

interface LogoutUserAction {
    type: UserActionType.LOGOUT
}

interface DontFetchAction {
    type: UserActionType.DONT_FETCH
}

export type UserActions = DontFetchAction | LoginUserAction | LogoutUserAction;

interface SetWishlistAction {
    type: WishlistActionType.SET_WISHLIST,
    payload: Wishlist[]
}

interface AddToWishlistAction {
    type: WishlistActionType.ADD_TO_WISHLIST,
    payload: Wishlist
}

interface RemoveFromWishlistAction {
    type: WishlistActionType.REMOVE_FROM_WISHLIST,
    payload: Wishlist
}

export type WishlistActions = AddToWishlistAction | RemoveFromWishlistAction | SetWishlistAction;