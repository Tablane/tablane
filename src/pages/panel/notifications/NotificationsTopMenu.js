import '../../../styles/TopMenu.scss'
import { useSelector } from "react-redux";
import styles from '../../../styles/NotificationsTopMenu.scss'

function NotificationsTopMenu(props) {
    const { board } = useSelector(state => state.board)

    return (
        <div className="TopMenu">
            <div>
                <div className="details">
                    {!props.sidebarOpen && (
                        <i onClick={props.toggleSideBar} className="fas fa-angle-double-right"> </i>
                    )}
                    <div className="info">
                        <h1>Notifications</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationsTopMenu