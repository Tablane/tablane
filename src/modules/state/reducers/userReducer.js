import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await axios({
        method: 'GET',
        withCredentials: true,
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/user`
    })
    return response.data
})

export const loginUser = createAsyncThunk('user/loginUser', async payload => {
    const response = await axios({
        method: 'POST',
        data: payload,
        withCredentials: true,
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/login`
    })
    return response.data
})

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async payload => {
        const response = await axios({
            method: 'POST',
            data: payload,
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/register`
        })
        return response.data
    }
)

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    const response = await axios({
        method: 'GET',
        withCredentials: true,
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/logout`
    })
    return response.data
})

export const clearNotification = createAsyncThunk(
    'user/clearNotification',
    async ({ workspaceId, taskId }) => {
        const response = await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/notification/${workspaceId}/${taskId}`
        })
        return response.data
    }
)

export const unclearNotification = createAsyncThunk(
    'user/unclearNotification',
    async ({ workspaceId, taskId }) => {
        const response = await axios({
            method: 'PATCH',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/notification/${workspaceId}/${taskId}`
        })
        return response.data
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: { status: 'loading' },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUser.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.status = 'succeeded'
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed'
            })

            .addCase(loginUser.pending, (state, action) => {
                state.submit = 'loading'
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.submit = 'succeeded'
                state.status = 'succeeded'
                toast('Successfully logged in')
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.submit = 'failed'
                toast('Username or password is wrong')
            })

            .addCase(logoutUser.fulfilled, (state, action) => {
                state.user = null
                state.status = 'logout'
                toast('Successfully logged out')
            })

            .addCase(registerUser.pending, (state, action) => {
                state.submit = 'loading'
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.status = 'succeeded'
                state.submit = 'succeeded'
                toast('Successfully registered')
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.submit = 'failed'
                toast('User Already Exists')
            })

            .addCase(clearNotification.pending, (state, action) => {
                const { workspaceId, taskId } = action.meta.arg

                const notifications = state.user.notifications.find(
                    x => (x.workspaceId = workspaceId)
                )
                const [notification] = notifications.new.splice(
                    notifications.new.indexOf(
                        notification => notification.taskId === taskId
                    ),
                    1
                )
                if (notification) notifications.cleared.unshift(notification)
            })
            .addCase(clearNotification.fulfilled, (state, action) => {})
            .addCase(clearNotification.rejected, (state, action) => {})

            .addCase(unclearNotification.pending, (state, action) => {
                const { workspaceId, taskId } = action.meta.arg

                const notifications = state.user.notifications.find(
                    x => (x.workspaceId = workspaceId)
                )
                const [notification] = notifications.cleared.splice(
                    notifications.cleared.indexOf(
                        notification => notification.taskId === taskId
                    ),
                    1
                )
                if (notification) notifications.new.unshift(notification)
            })
            .addCase(unclearNotification.fulfilled, (state, action) => {})
            .addCase(unclearNotification.rejected, (state, action) => {})
    }
})

export default userSlice.reducer
