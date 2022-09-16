import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { userApi } from './services/users'
import { workspaceApi } from './services/workspaces'

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [workspaceApi.reducerPath]: workspaceApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(userApi.middleware)
})

setupListeners(store.dispatch)
