import { createSlice } from '@reduxjs/toolkit'

const authReducer = createSlice({
    name: 'auth',
    initialState: { token: localStorage.getItem('access_token') },
    reducers: {
        setCurrentToken: (state, action) => {
            state.token = action.payload
        },
        logOut: (state, action) => {
            state.token = null
        }
    }
})

export const { setCurrentToken, logOut } = authReducer.actions

export default authReducer.reducer

export const selectCurrentToken = state => state.auth.token
