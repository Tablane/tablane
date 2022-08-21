import NotificationsTopMenu from "./notifications/NotificationsTopMenu";
import styles from '../../styles/Notifications.module.scss'
import Date from "../../utils/RelativeDate";

function Notifications(props) {
    const notifications = [
        {
            taskId: 'd146feb',
            changes: [
                {
                    user: 'user',
                    type: 'changed status',
                    from: { text: 'working on it', color: '#3f8dcc' },
                    to: { text: 'done', color: '#83be31' }
                }
            ]
        }
    ]

    return (
        <div className={styles.wrapper}>
            <NotificationsTopMenu sidebarOpen={props.sidebarOpen} toggleSideBar={props.toggleSideBar} />
            <div className={styles.panel}>
                <div className={styles.notifications}>
                    {notifications.map(notification => (
                        <div className={styles.group}>
                            <div>
                                <div>
                                    <div className={styles.taskLocation}>
                                        <span>Development > Product</span>
                                    </div>
                                    <div className={styles.taskName}>
                                        <span>Implement some new features</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.watch}>
                                        <i className="fa-regular fa-eye"></i>
                                    </div>
                                </div>
                            </div>
                            {notification.changes.map(change => (
                                <div className={styles.item}>
                                    <div>
                                        <span>{change.user} ({change.user}) from {change.user} to {change.user}</span>
                                    </div>
                                    <div>
                                        <Date timestamp={1661090332887} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Notifications