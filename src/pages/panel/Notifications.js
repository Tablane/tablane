import NotificationsTopMenu from './notifications/NotificationsTopMenu'
import styles from '../../styles/Notifications.module.scss'
import Date from '../../utils/RelativeDate'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip } from '@mui/material'
import {
    clearNotification,
    unclearNotification
} from '../../modules/state/reducers/userReducer'

function Notifications(props) {
    const params = useParams()
    const [tab, setTab] = useState('new')
    const { workspace } = useSelector(state => state.workspace)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const notifications = user.user.notifications.find(
        x => x.workspaceId === workspace.id
    )

    const handleClick = taskId => {
        if (tab === 'new') {
            dispatch(clearNotification({ workspaceId: workspace.id, taskId }))
        } else if (tab === 'cleared') {
            dispatch(unclearNotification({ workspaceId: workspace.id, taskId }))
        }
    }

    return (
        <div className={styles.wrapper}>
            <NotificationsTopMenu
                sidebarOpen={props.sidebarOpen}
                toggleSideBar={props.toggleSideBar}
                tab={tab}
                setTab={setTab}
            />
            <div className={styles.panel}>
                <div className={styles.notifications}>
                    {notifications[tab].length === 0 && (
                        <p>You have no unread notifications</p>
                    )}
                    {notifications[tab].map(notification => {
                        return (
                            <div
                                className={styles.group}
                                key={notification.taskId}
                            >
                                <div>
                                    <div>
                                        <Link
                                            to={`/${params.workspace}/${notification.location.space}/${notification.location.board}`}
                                        >
                                            <span>
                                                {notification.location.space} >{' '}
                                                {notification.location.board}
                                            </span>
                                        </Link>
                                        <Link
                                            to={`/${params.workspace}/${notification.location.space}/${notification.location.board}/${notification.taskId}`}
                                        >
                                            <div>
                                                <span>
                                                    {notification.taskName}
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
                                            <div className={styles.watch}>
                                                <i className="fa-regular fa-eye"></i>
                                            </div>
                                        </Tooltip>
                                        <Tooltip
                                            title={
                                                tab === 'new'
                                                    ? 'Clear notification'
                                                    : 'Unclear notification'
                                            }
                                            arrow
                                            placement="top"
                                        >
                                            <div
                                                className={styles.markRead}
                                                onClick={() =>
                                                    handleClick(
                                                        notification.taskId
                                                    )
                                                }
                                            >
                                                <div>
                                                    <i className="fa-solid fa-check"></i>
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
                                                <span className={styles.user}>
                                                    {change.user}
                                                </span>
                                                <div className={styles.type}>
                                                    <span>
                                                        {change.type.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className={styles.change}>
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                change.from
                                                                    .color
                                                        }}
                                                    >
                                                        {change.from.text}
                                                    </span>
                                                    <span>to</span>
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                change.to.color
                                                        }}
                                                    >
                                                        {change.to.text}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Date
                                                timestamp={change.timestamp}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Notifications
