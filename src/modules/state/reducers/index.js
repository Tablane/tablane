import {combineReducers} from 'redux'
import userReducer from "./userReducer";
import board from "./boardReducer";

const reducers = combineReducers({
    account: userReducer,
    board
})

export default reducers