import { Link, useParams } from 'react-router-dom'
import { Tooltip } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import RelativeDate from '../../../utils/RelativeDate'
import styles from '../../../styles/Notifications.module.scss'
import { diffWords } from 'diff'
import CommentChange from './notification/CommentChange.tsx'
import { Notification as NotificationType } from '../../../types/Notification'
import {
    useAddNotificationWatcherMutation,
    useRemoveNotificationWatcherMutation
} from '../../../modules/services/notificationSlice'
import { useFetchUserQuery } from '../../../modules/services/userSlice'
import ReplyNotification from './notification/ReplyNotification.tsx'

interface Props {
    notification: NotificationType
    handleClick: (taskId: string) => void
    condition: { cleared: boolean }
    workspaceId: string
}

export default function Notification({
    notification,
    handleClick,
    condition,
    workspaceId
}: Props) {
    const { data: user } = useFetchUserQuery()
    const [addWatcher] = useAddNotificationWatcherMutation()
    const [removeWatcher] = useRemoveNotificationWatcherMutation()
    const params = useParams()
    const board = notification.task.board
    const space = board.space

    const handleWatcher = () => {
        if (watching) {
            removeWatcher({
                taskId: notification.task._id,
                userId: user._id,
                workspaceId,
                condition
            })
        } else {
            addWatcher({
                taskId: notification.task._id,
                userId: user._id,
                workspaceId,
                condition
            })
        }
    }

    const getDiff = (from, to) => {
        const groups = diffWords(from, to)
        const mappedNodes = groups.map(({ value, added, removed }, i) => {
            if (added)
                return (
                    <span key={i} className="font-medium">
                        {value}
                    </span>
                )
            else if (removed)
                return (
                    <span key={i} className="line-through opacity-50">
                        {value}
                    </span>
                )
            else
                return (
                    <span key={i} className="">
                        {value}
                    </span>
                )
        })
        return <span>{mappedNodes}</span>
    }

    const watching = Boolean(
        notification.task.watcher.find(x => x._id === user._id)
    )
    return (
        <div className={styles.group} key={notification.task._id}>
            <div>
                <div>
                    <Link
                        to={`/${params.workspace}/${space.name}/${board.name}`}
                    >
                        <span>
                            {space.name}
                            {' > '}
                            {board.name}
                        </span>
                    </Link>
                    <Link
                        to={`/${params.workspace}/${space.name}/${board.name}/${notification.task._id}`}
                    >
                        <div>
                            <span>{notification.task.name}</span>
                        </div>
                    </Link>
                </div>
                <div>
                    <Tooltip
                        disableInteractive
                        title={
                            watching
                                ? 'Stop receiving notifications'
                                : 'Watch to receive notifications'
                        }
                        arrow
                        className={watching ? 'text-[#4169e1]' : ''}
                        placement="top"
                    >
                        <div onClick={handleWatcher} className={styles.watch}>
                            <FontAwesomeIcon icon={regular('eye')} />
                        </div>
                    </Tooltip>
                    <Tooltip
                        disableInteractive
                        title={
                            condition.cleared
                                ? 'Unclear notification'
                                : 'Clear notification'
                        }
                        arrow
                        placement="top"
                    >
                        <div
                            className={styles.markRead}
                            onClick={() => handleClick(notification.task._id)}
                        >
                            <div>
                                {condition.cleared ? (
                                    <FontAwesomeIcon
                                        icon={solid('rotate-left')}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={solid('check')} />
                                )}
                            </div>
                        </div>
                    </Tooltip>
                </div>
            </div>
            {notification.changes.map(change => {
                if (change.change_type === 'new comment') {
                    return (
                        <CommentChange
                            key={change.timestamp}
                            boardId={notification.task.board._id}
                            taskId={notification.task._id}
                            change={change}
                        />
                    )
                }
                if (change.change_type === 'new reply') {
                    return (
                        <ReplyNotification
                            actor={change.actor}
                            key={change.timestamp}
                            change={change}
                        />
                    )
                }
                return (
                    <div
                        className={styles.item + ' h-fit'}
                        key={change.timestamp}
                    >
                        <div>
                            <div className="flex items-center justify-center">
                                <span className={styles.user}>
                                    {change.actor.username}
                                </span>
                                <div className={styles.type}>
                                    {change.change_type === 'changed field' ? (
                                        <span>
                                            {'CHANGED ' +
                                                change.field_name.toUpperCase()}
                                        </span>
                                    ) : (
                                        <span>
                                            {change.change_type.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {change.field_type === 'status' && (
                                    <div className={styles.change}>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    change.payload.from.color
                                            }}
                                        >
                                            {change.payload.from.text}
                                        </span>
                                        <span>to</span>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    change.payload.to.color
                                            }}
                                        >
                                            {change.payload.to.text}
                                        </span>
                                    </div>
                                )}
                                {(change.change_type === 'changed name' ||
                                    change?.field_type === 'text') && (
                                    <div className="flex items-center text-[#2a2e34]">
                                        {getDiff(
                                            change.payload.from.text,
                                            change.payload.to.text
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <RelativeDate timestamp={change.timestamp} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
