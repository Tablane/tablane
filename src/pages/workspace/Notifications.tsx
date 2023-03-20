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
import { Notification as NotificationType } from '../../types/Notification.d.ts'

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
    const notificationss: NotificationType[] = data?.notifications

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
            task: {
                _id: '6416bc0024735aa2b93dd7e0',
                name: 'implement new integrations',
                board: {
                    space: {
                        _id: '63f8f559107c89bcf8fcb6fb',
                        name: 'test'
                    },
                    _id: '640ee59d3141294082f5705f',
                    name: 'test'
                },
                watcher: [
                    {
                        _id: '63efc31fb97957af5590ac2f',
                        username: 'game'
                    },
                    {
                        _id: '64121a5e00fd8981f8113716',
                        username: 'test'
                    }
                ]
            },
            changes: [
                {
                    timestamp: 1679219996795,
                    actor: {
                        username: 'test'
                    },
                    referencedComment: {
                        replies: []
                    },
                    change_type: 'changed name',
                    payload: {
                        from: {
                            text: 'implement new integration'
                        },
                        to: {
                            text: 'implement new integrations'
                        }
                    }
                },
                {
                    timestamp: 1679211534703,
                    actor: {
                        username: 'test'
                    },
                    referencedComment: {
                        _id: '6416bc0e6d4d4aa9586b4ea0',
                        type: 'comment',
                        author: { username: 'nuke' },
                        content: {
                            type: 'doc',
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'should we do that?'
                                        }
                                    ]
                                }
                            ]
                        },
                        timestamp: '1679211534696',
                        task: '6416bc0024735aa2b93dd7e0',
                        replies: [],
                        __v: 0
                    },
                    change_type: 'new comment',
                    payload: null
                },
                {
                    timestamp: 1679211534704,
                    actor: {
                        username: 'test'
                    },
                    referencedComment: {
                        _id: '6416bc0e6d4d4aa9586b4ea0',
                        type: 'comment',
                        author: { username: 'nuke2' },
                        content: {
                            type: 'doc',
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'yeah definitely'
                                        }
                                    ]
                                }
                            ]
                        },
                        timestamp: '1679211534696',
                        task: '6416bc0024735aa2b93dd7e0',
                        replies: [],
                        __v: 0
                    },
                    change_type: 'new reply',
                    payload: null
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
                            {!error && !(notifications?.length > 0) && (
                                <p>You have no unread notifications</p>
                            )}
                            {!error &&
                                notifications?.map((notification, i) => (
                                    <Notification
                                        key={i}
                                        notification={notification}
                                        condition={condition}
                                        handleClick={handleClick}
                                        workspaceId={workspace._id}
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
