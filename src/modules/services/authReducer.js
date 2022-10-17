import { createSlice } from '@reduxjs/toolkit'

const authReducer = createSlice({
    name: 'auth',
    initialState: { token: localStorage.getItem('access_token') },
    reducers: {
        setCurrentToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setCurrentToken } = authReducer.actions

export default authReducer.reducer

export const selectCurrentToken = state => state.auth.token
