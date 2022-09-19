import styles from '../../../styles/NotificationsTopMenu.module.scss'

function NotificationsTopMenu(props) {
    return (
        <div className={styles.TopMenu}>
            <div>
                <div className={styles.details}>
                    {!props.sidebarOpen && (
                        <i
                            onClick={props.toggleSideBar}
                            className="fas fa-angle-double-right"
                        >
                            {' '}
                        </i>
                    )}
                    <div>
                        <h1>Notifications</h1>
                    </div>
                    <div className={styles.tabs}>
                        <div
                            onClick={() =>
                                props.updateCondition({ cleared: false })
                            }
                            className={`${styles.tab} ${
                                !props.condition.cleared && styles.active
                            }`}
                        >
                            <div>
                                <span>New</span>
                            </div>
                        </div>
                        <div
                            onClick={() =>
                                props.updateCondition({ cleared: true })
                            }
                            className={`${styles.tab} ${
                                props.condition.cleared && styles.active
                            }`}
                        >
                            <div>
                                <span>Cleared</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationsTopMenu
