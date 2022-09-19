import { api } from './api'

export const notificationApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchNotifications: builder.query({
            query: ({ workspaceId, condition }) => ({
                url: `notification/${workspaceId}`,
                method: 'POST',
                body: { condition }
            })
        }),
        clearNotification: builder.mutation({
            query: ({ workspaceId, taskId, condition }) => ({
                url: `notification/${workspaceId}/${taskId}`,
                method: 'DELETE',
                body: { condition }
            }),
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
                    await queryFulfilled.then(x => console.log(x))
                } catch {
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
