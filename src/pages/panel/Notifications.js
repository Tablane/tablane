import NotificationsTopMenu from "./notifications/NotificationsTopMenu";
import styles from '../../styles/Notifications.module.scss'
import Date from "../../utils/RelativeDate";

function Notifications(props) {
    const notifications = [
        {
            taskId: 'd146feb',
            taskName: '',
            changes: [
                {
                    timestamp: 1661090332887,
                    user: 'user',
                    type: 'changed status',
                    from: { text: 'working on it', color: '#3f8dcc' },
                    to: { text: 'done', color: '#83be31' }
                },
                {
                    timestamp: 1661161230176,
                    user: 'users',
                    type: 'changed status',
                    from: { text: 'done', color: '#83be31' },
                    to: { text: 'under review', color: '#9731ad' }
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
                                <div className={styles.item} key={change.timestamp + change.from.toString()}>
                                    <div>
                                        <span>{change.user} ({change.user.toUpperCase()}) from {change.user} to {change.user}</span>
                                    </div>
                                    <div>
                                        <Date timestamp={change.timestamp} />
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