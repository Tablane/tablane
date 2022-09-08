import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchNotifications = createAsyncThunk(
    'user/fetchNotifications',
    async ({ workspaceId, condition }) => {
        const response = await axios({
            method: 'POST',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/notification/${workspaceId}`,
            data: {
                condition
            }
        })
        return response.data
    }
)

export const clearNotification = createAsyncThunk(
    'user/clearNotification',
    async ({ workspaceId, taskId, condition }) => {
        const response = await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/notification/${workspaceId}/${taskId}`,
            data: {
                condition
            }
        })
        return response.data
    }
)

export const unclearNotification = createAsyncThunk(
    'user/unclearNotification',
    async ({ workspaceId, taskId, condition }) => {
        const response = await axios({
            method: 'PATCH',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/notification/${workspaceId}/${taskId}`,
            data: {
                condition
            }
        })
        return response.data
    }
)

const notificationSlice = createSlice({
    name: 'notification',
    initialState: { status: 'loading', loading: 0 },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchNotifications.pending, (state, action) => {
                state.loading = state.loading + 1
                state.status = 'loading'
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = state.loading - 1
                state.notifications = action.payload
                state.status = 'succeeded'
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = state.loading - 1
                state.status = 'failed'
            })

            .addCase(clearNotification.pending, (state, action) => {
                const { taskId } = action.meta.arg

                state.notifications = state.notifications.filter(
                    x => x.task._id !== taskId
                )
            })
            .addCase(clearNotification.fulfilled, (state, action) => {})
            .addCase(clearNotification.rejected, (state, action) => {})

            .addCase(unclearNotification.pending, (state, action) => {
                const { taskId } = action.meta.arg

                state.notifications = state.notifications.filter(
                    x => x.task._id !== taskId
                )
            })
            .addCase(unclearNotification.fulfilled, (state, action) => {})
            .addCase(unclearNotification.rejected, (state, action) => {})
    }
})

export default notificationSlice.reducer
