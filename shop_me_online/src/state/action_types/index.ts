export enum ProductsActionType {
    SET_FILTERED_PRODUCTS = "set_filtered_products",
    SET_PRODUCTS = "set_products",
    FILTER = "filter",
    UPDATE_SUPPLY = "update_supply",
    DONT_FETCH_PRODUCTS = "dont_fetch_products"
}

export enum CartActionType {
    SET = "set",
    ADD_PRODUCT = "add_product",
    SET_PAID = "set_paid",
    SET_NOT_PAID = "set_not_paid",
    REMOVE = "remove"
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