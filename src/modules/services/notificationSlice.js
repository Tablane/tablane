import { api } from './api'
import handleQueryError from '../../utils/handleQueryError'
import { current } from 'immer'

export const notificationApi = api.injectEndpoints({
    endpoints: builder => ({
        tagTypes: ['Notifications'],
        fetchNotifications: builder.query({
            query: ({ workspaceId, condition }) => ({
                url: `notification/${workspaceId}`,
                method: 'POST',
                body: { condition }
            }),
            keepUnusedDataFor: 0,
            providesTags: ['Notifications']
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
                            return {
                                notifications:
                                    notifications.notifications.filter(
                                        x => x.task._id !== taskId
                                    )
                            }
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch (err) {
                    if (handleQueryError({ err })) patchResult.undo()
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
                            return {
                                notifications:
                                    notifications.notifications.filter(
                                        x => x.task._id !== taskId
                                    )
                            }
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch (err) {
                    if (handleQueryError({ err })) patchResult.undo()
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
