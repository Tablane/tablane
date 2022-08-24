import NotificationsTopMenu from "./notifications/NotificationsTopMenu";
import styles from '../../styles/Notifications.module.scss'
import Date from "../../utils/RelativeDate";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Notifications(props) {
    const params = useParams()
    const [tab, setTab] = useState('new')

    const notifications = [
        {
            taskId: 'd146feb',
            taskName: 'Implement some new features',
            location: {
                space: 'Development',
                board: 'Product'
            },
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
        },
        {
            taskId: 'b624ueg',
            taskName: 'Random is something',
            location: {
                space: 'test',
                board: 'test'
            },
            changes: [
                {
                    timestamp: 1661090332887,
                    user: 'user',
                    type: 'changed status',
                    from: { text: 'working on it', color: 'rgb(85, 89, 223)' },
                    to: { text: 'done', color: 'rgb(0, 200, 117)' }
                },
                {
                    timestamp: 1661161230176,
                    user: 'users',
                    type: 'changed status',
                    from: { text: 'done', color: 'rgb(0, 200, 117)' },
                    to: { text: 'under review', color: 'rgb(226, 68, 92)' }
                }
            ]
        }
    ]

    return (
        <div className={styles.wrapper}>
            <NotificationsTopMenu
                sidebarOpen={props.sidebarOpen}
                toggleSideBar={props.toggleSideBar}
                tab={tab}
                setTab={setTab} />
            <div className={styles.panel}>
                <div className={styles.notifications}>
                    {notifications.map(notification => (
                        <div className={styles.group} key={notification.taskId}>
                            <div>
                                <div>
                                    <Link to={`/${params.workspace}/${notification.location.space}/${notification.location.board}`}>
                                        <span>{notification.location.space} > {notification.location.board}</span>
                                    </Link>
                                    <div>
                                        <span>{notification.taskName}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.watch}>
                                        <i className="fa-regular fa-eye"></i>
                                    </div>
                                    <div className={styles.markRead}>
                                        <div>
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {notification.changes.map(change => (
                                <div className={styles.item} key={change.timestamp + change.from.toString()}>
                                    <div>
                                        <div>
                                            <span className={styles.user}>{change.user}</span>
                                            <div className={styles.type}>
                                                <span>{change.type.toUpperCase()}</span>
                                            </div>
                                            <div className={styles.change}>
                                                <span style={{backgroundColor: change.from.color}}>{change.from.text}</span>
                                                <span>to</span>
                                                <span style={{backgroundColor: change.to.color}}>{change.to.text}</span>
                                            </div>
                                        </div>
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