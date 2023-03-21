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
    const notifications: NotificationType[] = data?.notifications

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
