import { useSelector } from 'react-redux'
import styles from '../../../styles/NotificationsTopMenu.module.scss'

function NotificationsTopMenu(props) {
    const { board } = useSelector(state => state.board)

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
                            onClick={() => props.setTab('new')}
                            className={`${styles.tab} ${
                                props.tab === 'new' && styles.active
                            }`}
                        >
                            <div>
                                <span>New</span>
                            </div>
                        </div>
                        <div
                            onClick={() => props.setTab('cleared')}
                            className={`${styles.tab} ${
                                props.tab === 'cleared' && styles.active
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
