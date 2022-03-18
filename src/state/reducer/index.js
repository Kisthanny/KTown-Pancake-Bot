import { combineReducers } from "redux"
import txReducer from "./txReducer";
import workingAccountReducer from "./workingAccountReducer"
import workflowReducer from "./workflowReducer";
import transactSwitchReducer from "./transactSwitchReducer";
import transactModeReducer from "./transactModeReducer";
const reducers = combineReducers({
    txList: txReducer,
    workingList: workingAccountReducer,
    workflow: workflowReducer,
    transactSwitch: transactSwitchReducer,
    transactMode: transactModeReducer
})

export default reducers