import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import boardReducer from "./reducers/boardReducer";

export const store = configureStore({
    reducer: {
        user: userReducer,
        board: boardReducer
    }
})


