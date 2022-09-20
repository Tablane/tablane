import styles from '../../../styles/NotificationsTopMenu.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import React from 'react'

function NotificationsTopMenu(props) {
    return (
        <div className={styles.TopMenu}>
            <div>
                <div className={styles.details}>
                    {!props.sidebarOpen && (
                        <FontAwesomeIcon
                            icon={solid('angle-double-right')}
                            onClick={props.toggleSideBar}
                        />
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
