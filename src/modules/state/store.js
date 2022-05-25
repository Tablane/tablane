import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import boardReducer from "./reducers/boardReducer";
import workspaceReducer from "./reducers/workspaceReducer";

export const store = configureStore({
    reducer: {
        user: userReducer,
        board: boardReducer,
        workspace: workspaceReducer
    }
})


