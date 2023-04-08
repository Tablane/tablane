import { api } from './api'
import handleQueryError from '../../utils/handleQueryError'
import pusher from '../../pusher/pusher.ts'

export const notificationApi = api.injectEndpoints({
    endpoints: builder => ({
        tagTypes: ['Notifications'],
        fetchNotifications: builder.query({
            query: ({ workspaceId, condition }) => ({
                url: `notification/${workspaceId}`,
                method: 'POST',
                body: { condition }
            }),
            refetchOnFocus: true,
            keepUnusedDataFor: 0,
            providesTags: ['Notifications']
        }),
        getUnseenCount: builder.query({
            query: ({ workspaceId }) => ({
                url: `notification/${workspaceId}/unseen`
            }),
            async onCacheEntryAdded(
                { userId, workspaceId },
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                let channel
                try {
                    await cacheDataLoaded
                    channel = pusher.subscribe('private-user-' + userId)
                    channel.bind('notification-update-' + workspaceId, data => {
                        if (data === 'add-one') {
                            updateCachedData(notification => {
                                notification.unseenCount =
                                    notification.unseenCount + 1
                            })
                        } else if (data === 'reset') {
                            updateCachedData(notification => {
                                notification.unseenCount = 0
                            })
                        }
                    })
                } catch (err) {
                    handleQueryError({ err })
                }
                await cacheEntryRemoved
                channel.unbind()
            },
            keepUnusedDataFor: 5,
            providesTags: ['NotificationUnseenCount']
        }),
        clearNotification: builder.mutation({
            query: ({ workspaceId, taskId, condition, changeIds }) => ({
                url: `notification/${workspaceId}/${taskId}/changes`,
                method: 'DELETE',
                body: { condition, changeIds }
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
            query: ({ workspaceId, taskId, condition, changeIds }) => ({
                url: `notification/${workspaceId}/${taskId}/changes`,
                method: 'PATCH',
                body: { condition, changeIds }
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
        addNotificationWatcher: builder.mutation({
            query: ({ taskId, userId }) => ({
                url: `task/watcher/${taskId}`,
                method: 'POST',
                body: { userId }
            }),
            async onQueryStarted(
                { taskId, workspaceId, condition, userId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    notificationApi.util.updateQueryData(
                        'fetchNotifications',
                        { workspaceId, condition },
                        ({ notifications }) => {
                            notifications
                                .find(x => x.task._id === taskId)
                                .task.watcher.push({ _id: userId })
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
        removeNotificationWatcher: builder.mutation({
            query: ({ taskId, userId }) => ({
                url: `task/watcher/${taskId}`,
                method: 'DELETE',
                body: { userId }
            }),
            async onQueryStarted(
                { taskId, workspaceId, condition, userId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    notificationApi.util.updateQueryData(
                        'fetchNotifications',
                        { workspaceId, condition },
                        ({ notifications }) => {
                            notifications.find(
                                x => x.task._id === taskId
                            ).task.watcher = notifications
                                .find(x => x.task._id === taskId)
                                .task.watcher.filter(x => x._id !== userId)
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
    useGetUnseenCountQuery,
    useClearNotificationMutation,
    useUnclearNotificationMutation,
    useAddNotificationWatcherMutation,
    useRemoveNotificationWatcherMutation
} = notificationApi
