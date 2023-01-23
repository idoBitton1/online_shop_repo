import { TransactionsActions } from "../actions";
import { TransactionActionType } from "../action_types";

const initial_state: string = "";

const reducer = (state: string = initial_state, action: TransactionsActions) => {
    switch (action.type) {
        case TransactionActionType.SET_TRANSACTION_ID:
            return action.payload;
        default:
            return state;
    }
}

export default reducer;