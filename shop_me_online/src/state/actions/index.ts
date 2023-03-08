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
//transactions
import { TransactionActionType } from "../action_types";

export interface UpdateSupplyProps {
    id: string,
    amount: number
}

export interface UpdateProductProps {
    id: string,
    new_price: number,
    new_quantity: number,
    new_categories: string,
    is_image_uploaded: boolean
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

interface UpdateProductAction {
    type: ProductsActionType.UPDATE_PRODUCT,
    payload: UpdateProductProps
}

interface AddToProductsAction {
    type: ProductsActionType.ADD_TO_PRODUCTS,
    payload: Product
}

export type ProductsActions = SetFilteredProductsAction | SetProductsAction | FilterAction | UpdateSupplyAction | UpdateProductAction | AddToProductsAction;

interface SetCartAction {
    type: CartActionType.SET,
    payload: CartProduct[]
}

interface AddProductAction {
    type: CartActionType.ADD_PRODUCT,
    payload: CartProduct
}

interface RemoveFromCartAction {
    type: CartActionType.REMOVE,
    payload: string
}

export interface ChangeQuantityProperties {
    item_id: string,
    new_value: number
}

interface ChangeAmountAction {
    type: CartActionType.CHANGE_AMOUNT,
    payload: ChangeQuantityProperties
}

export interface ChangeSizeProperties {
    item_id: string,
    new_value: string
}

interface ChangeSizeAction {
    type: CartActionType.CHANGE_SIZE,
    payload: ChangeSizeProperties
}

export type CartActions = SetCartAction | AddProductAction | RemoveFromCartAction | ChangeAmountAction | ChangeSizeAction;

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

//Transactions
interface SetTransactionIdAction {
    type: TransactionActionType.SET_TRANSACTION_ID,
    payload: string
}

export type TransactionsActions = SetTransactionIdAction;