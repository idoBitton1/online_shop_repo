import jwtDecode from "jwt-decode";
import { UserActions } from "../actions";
import { UserActionType } from "../action_types"

export interface MyToken {
    name: string,
    exp: number,
    iat: number,
    user_id: string,
    email: string,
    is_manager: boolean
}

export interface UserInfo {
    token: MyToken | null,
    fetch_info: boolean
}

const initial_state: UserInfo = {
    token: null,
    fetch_info: true
}
//localStorage.removeItem("token");
let token = localStorage.getItem("token")
if(token) {
    const decoded_token: MyToken = jwtDecode<MyToken>(token);

    if(decoded_token.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
    } else {
        initial_state.token = decoded_token;
    }
}

const reducer = (state: UserInfo = initial_state, action: UserActions) => {
    switch (action.type) {
        case UserActionType.LOGIN:
            const decoded_token: MyToken = jwtDecode<MyToken>(action.payload);

            if(decoded_token.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
            } else {
                state.token = decoded_token;
            }
            return {
                ...state
            }
        case UserActionType.LOGOUT:
            localStorage.removeItem("token");
            return {
                token: null,
                fetch_info: true
            }
        case UserActionType.DONT_FETCH:
            return {
                ...state,
                fetch_info: false
            }
        default:
            return state;
    }
}

export default reducer;