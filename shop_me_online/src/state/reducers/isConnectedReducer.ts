import { IsConnectedActions } from "../actions";
import { IsConnectedActionType } from "../action_types"

const initial_state: boolean = false;

const reducer = (state: boolean = initial_state, action: IsConnectedActions) => {
    switch(action.type)
    {
        case IsConnectedActionType.CONNECT:
            return true;
        case IsConnectedActionType.DISCONNECT:
            return false;
        default:
            return state;
    }
}

export default reducer;