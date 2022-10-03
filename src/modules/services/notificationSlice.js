import { api } from './api'
import { toast } from 'react-hot-toast'

export const notificationApi = api.injectEndpoints({
    endpoints: builder => ({
        tagTypes: ['Notifications'],
        fetchNotifications: builder.query({
            query: ({ workspaceId, condition }) => ({
                url: `notification/${workspaceId}`,
                method: 'POST',
                body: { condition }
            }),
            providesTags: ['Notifications']
        }),
        clearNotification: builder.mutation({
            query: ({ workspaceId, taskId, condition }) => ({
                url: `notification/${workspaceId}/${taskId}`,
                method: 'DELETE',
                body: { condition }
            }),
            invalidatesTags: ['Notifications'],
            async onQueryStarted(
                { taskId, workspaceId, condition },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    notificationApi.util.updateQueryData(
                        'fetchNotifications',
                        { workspaceId, condition },
                        notifications => {
                            return notifications.filter(
                                x => x.task._id !== taskId
                            )
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        }),
        unclearNotification: builder.mutation({
            query: ({ workspaceId, taskId, condition }) => ({
                url: `notification/${workspaceId}/${taskId}`,
                method: 'PATCH',
                body: { condition }
            }),
            invalidatesTags: ['Notifications'],
            async onQueryStarted(
                { taskId, workspaceId, condition },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    notificationApi.util.updateQueryData(
                        'fetchNotifications',
                        { workspaceId, condition },
                        notifications => {
                            return notifications.filter(
                                x => x.task._id !== taskId
                            )
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    toast('Something went wrong')
                    patchResult.undo()
                }
            }
        })
    })
})

export const {
    useFetchNotificationsQuery,
    useClearNotificationMutation,
    useUnclearNotificationMutation
} = notificationApi
