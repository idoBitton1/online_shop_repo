export enum ProductsActionType {
    SET_FILTERED_PRODUCTS = "set_filtered_products",
    SET_PRODUCTS = "set_products",
    FILTER = "filter",
    UPDATE_SUPPLY = "update_supply",
    UPDATE_PRODUCT = "update_product",
    ADD_TO_PRODUCTS = "add_to_products"
}

export enum CartActionType {
    SET = "set",
    ADD_PRODUCT = "add_product",
    REMOVE = "remove",
    CHANGE_AMOUNT = "change_amount",
    CHANGE_SIZE = "change_size"
}

export enum UserActionType {
    LOGIN = "login",
    LOGOUT = "logout",
    DONT_FETCH = "dont_fetch"
}

export enum WishlistActionType {
    SET_WISHLIST = "set_wishlist",
    ADD_TO_WISHLIST = "add_to_wishlist",
    REMOVE_FROM_WISHLIST = "remove_from_wishlist"
}

export enum TransactionActionType {
    SET_TRANSACTION_ID = "set_transaction_id"
}