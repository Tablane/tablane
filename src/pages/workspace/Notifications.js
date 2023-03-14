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
    const {
        data: notificationss,
        isFetching,
        error
    } = useFetchNotificationsQuery({
        workspaceId: workspace._id,
        condition
    })

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

    const notifications = [
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
                    from: { text: 'working on it', color: '#3f8dcc' },
                    to: { text: 'done', color: '#83be31' }
                },
                {
                    timestamp: 1678790811414,
                    user: { username: 'game' },
                    change_type: 'changed name',
                    from: { text: 'abc' },
                    to: { text: 'a' }
                },
                {
                    timestamp: 1678790811413,
                    user: { username: 'game' },
                    change_type: 'new comment',
                    payload: {
                        _id: '64105dcfdc90529e4c388b14',
                        type: 'comment',
                        author: {
                            _id: '63efc31fb97957af5590ac2f',
                            username: 'game'
                        },
                        content: {
                            type: 'doc',
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'this is a sample comment'
                                        }
                                    ]
                                }
                            ]
                        },
                        timestamp: '1678794191092',
                        task: '64105b9cad4e504677fea964',
                        replies: [],
                        __v: 0
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
