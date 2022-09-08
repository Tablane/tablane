import NotificationsTopMenu from './notifications/NotificationsTopMenu'
import styles from '../../styles/Notifications.module.scss'
import Date from '../../utils/RelativeDate'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinearProgress, Tooltip } from '@mui/material'
import {
    clearNotification,
    fetchNotifications,
    unclearNotification
} from '../../modules/state/reducers/notificationReducer'

function Notifications(props) {
    const params = useParams()
    const dispatch = useDispatch()
    const [condition, setCondition] = useState({ cleared: false })
    const { workspace } = useSelector(state => state.workspace)
    const { notifications, loading } = useSelector(state => state.notification)

    const handleClick = taskId => {
        if (!condition.cleared) {
            dispatch(
                clearNotification({
                    workspaceId: workspace._id,
                    taskId,
                    condition
                })
            )
        } else if (condition.cleared) {
            dispatch(
                unclearNotification({
                    workspaceId: workspace._id,
                    taskId,
                    condition
                })
            )
        }
    }

    useEffect(() => {
        dispatch(fetchNotifications({ workspaceId: workspace._id, condition }))
    }, [condition])

    const updateCondition = options => {
        setCondition({ ...condition, ...options })
    }

    const groupedNotifications = []
    notifications?.map(notification => {
        const foundTask = groupedNotifications.find(
            x => x.task._id === notification.task._id
        )
        if (foundTask) {
            foundTask.changes.push(notification)
        } else {
            groupedNotifications.push({
                task: notification.task,
                changes: [notification]
            })
        }
    })

    return (
        <div className={styles.wrapper}>
            <NotificationsTopMenu
                sidebarOpen={props.sidebarOpen}
                toggleSideBar={props.toggleSideBar}
                condition={condition}
                updateCondition={updateCondition}
            />
            <div className={styles.panel}>
                {loading > 0 ? (
                    <LinearProgress />
                ) : (
                    <>
                        {' '}
                        <div className="loading-placeholder"></div>
                        <div className={styles.notifications}>
                            {groupedNotifications.length === 0 && (
                                <p>You have no unread notifications</p>
                            )}
                            {groupedNotifications.map(notification => {
                                const board = notification.task.board
                                const space = board.space
                                return (
                                    <div
                                        className={styles.group}
                                        key={notification.task._id}
                                    >
                                        <div>
                                            <div>
                                                <Link
                                                    to={`/${params.workspace}/${space.name}/${board.name}`}
                                                >
                                                    <span>
                                                        {space.name} >{' '}
                                                        {board.name}
                                                    </span>
                                                </Link>
                                                <Link
                                                    to={`/${params.workspace}/${space.name}/${board.name}/${notification.task._id}`}
                                                >
                                                    <div>
                                                        <span>
                                                            {
                                                                notification
                                                                    .task.name
                                                            }
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div>
                                                <Tooltip
                                                    title="Stop watching"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <div
                                                        className={styles.watch}
                                                    >
                                                        <i className="fa-regular fa-eye"></i>
                                                    </div>
                                                </Tooltip>
                                                <Tooltip
                                                    title={
                                                        condition.cleared
                                                            ? 'Unclear notification'
                                                            : 'Clear notification'
                                                    }
                                                    arrow
                                                    placement="top"
                                                >
                                                    <div
                                                        className={
                                                            styles.markRead
                                                        }
                                                        onClick={() =>
                                                            handleClick(
                                                                notification
                                                                    .task._id
                                                            )
                                                        }
                                                    >
                                                        <div>
                                                            {condition.cleared ? (
                                                                <i className="fa-solid fa-rotate-left"></i>
                                                            ) : (
                                                                <i className="fa-solid fa-check"></i>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        {notification.changes.map(change => (
                                            <div
                                                className={styles.item}
                                                key={
                                                    change.timestamp +
                                                    change.from.toString()
                                                }
                                            >
                                                <div>
                                                    <div>
                                                        <span
                                                            className={
                                                                styles.user
                                                            }
                                                        >
                                                            {
                                                                change.user
                                                                    .username
                                                            }
                                                        </span>
                                                        <div
                                                            className={
                                                                styles.type
                                                            }
                                                        >
                                                            <span>
                                                                {change.change_type.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.change
                                                            }
                                                        >
                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        change
                                                                            .from
                                                                            .color
                                                                }}
                                                            >
                                                                {
                                                                    change.from
                                                                        .text
                                                                }
                                                            </span>
                                                            <span>to</span>
                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        change
                                                                            .to
                                                                            .color
                                                                }}
                                                            >
                                                                {change.to.text}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Date
                                                        timestamp={
                                                            change.timestamp
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Notifications
