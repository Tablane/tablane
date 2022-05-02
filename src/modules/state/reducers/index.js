import {combineReducers} from 'redux'
import userReducer from "./userReducer";

const reducers = combineReducers({
    account: userReducer
})

export default reducers