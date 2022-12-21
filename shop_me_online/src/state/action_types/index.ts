export enum FilterProductsActionType {
    RESET = "reset",
    FILTER = "filter",
    UPDATE_SUPPLY = "update_supply"
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