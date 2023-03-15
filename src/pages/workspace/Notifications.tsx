import NotificationsTopMenu from './notifications/NotificationsTopMenu'
import styles from '../../styles/Notifications.module.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { LinearProgress } from '@mui/material'
import { useFetchWorkspaceQuery } from '../../modules/services/workspaceSlice'
import {
    useClearNotificationMutation,
    useFetchNotificationsQuery,
    useUnclearNotificationMutation
} from '../../modules/services/notificationSlice'
import Notification from './notifications/Notification.tsx'

function Notifications(props) {
    const [clearNotification] = useClearNotificationMutation()
    const [condition, setCondition] = useState({ cleared: false })
    const [unclearNotification] = useUnclearNotificationMutation()
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data, isFetching, error } = useFetchNotificationsQuery({
        workspaceId: workspace._id,
        condition
    })
    const notifications = data?.notifications

    const handleClick = taskId => {
        if (!condition.cleared) {
            clearNotification({
                workspaceId: workspace._id,
                taskId,
                condition
            })
        } else if (condition.cleared) {
            unclearNotification({
                workspaceId: workspace._id,
                taskId,
                condition
            })
        }
    }

    const updateCondition = options => {
        setCondition({ ...condition, ...options })
    }

    const notifications_example = [
        {
            _id: '123412341234',
            task: {
                name: 'a',
                _id: '64105b9cad4e504677fea964',
                board: {
                    _id: '640ee59d3141294082f5705f',
                    name: 'test',
                    space: {
                        _id: '63f8f559107c89bcf8fcb6fb',
                        name: 'test'
                    }
                }
            },
            changes: [
                {
                    timestamp: 1678790815414,
                    user: { username: 'game' },
                    change_type: 'changed status',
                    payload: {
                        from: { text: 'working on it', color: '#3f8dcc' },
                        to: { text: 'done', color: '#83be31' }
                    }
                },
                {
                    timestamp: 1678790811414,
                    user: { username: 'game' },
                    change_type: 'changed name',
                    payload: {
                        from: { text: 'abc' },
                        to: { text: 'a' }
                    }
                }
            ]
        },
        {
            _id: '123412341234',
            task: {
                name: 'a',
                _id: '64105b9cad4e504677fea964',
                board: {
                    _id: '640ee59d3141294082f5705f',
                    name: 'test',
                    space: {
                        _id: '63f8f559107c89bcf8fcb6fb',
                        name: 'test'
                    }
                }
            },
            changes: [
                {
                    timestamp: 1678790815414,
                    user: { username: 'game' },
                    change_type: 'changed status',
                    payload: {
                        from: { text: 'working on it', color: '#3f8dcc' },
                        to: { text: 'done', color: '#83be31' }
                    }
                },
                {
                    timestamp: 1678790811414,
                    user: { username: 'game' },
                    change_type: 'changed name',
                    payload: {
                        from: { text: 'abc' },
                        to: { text: 'a' }
                    }
                }
            ]
        }
    ]

    return (
        <div className={styles.wrapper}>
            <NotificationsTopMenu
                sidebarOpen={props.sidebarOpen}
                toggleSideBar={props.toggleSideBar}
                condition={condition}
                updateCondition={updateCondition}
            />
            <div className={styles.panel}>
                {isFetching ? (
                    <LinearProgress />
                ) : (
                    <>
                        <div className="loading-placeholder"></div>
                        <div className={styles.notifications}>
                            {error && (
                                <div className={styles.errorWrapper}>
                                    <p className={styles.title}>
                                        Sorry, we're having trouble displaying
                                        your notifications.
                                    </p>
                                    <span>Please try again.</span>
                                </div>
                            )}
                            {!error && notifications?.length === 0 && (
                                <p>You have no unread notifications</p>
                            )}
                            {!error &&
                                notifications?.map(notification => (
                                    <Notification
                                        key={notification._id}
                                        notification={notification}
                                        condition={condition}
                                        handleClick={handleClick}
                                    />
                                ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Notifications
