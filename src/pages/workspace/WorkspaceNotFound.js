import styles from '../../styles/WorkspaceNotFound.module.scss'
import { useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '../../modules/services/userSlice'

function WorkspaceNotFound() {
    const [logoutUser] = useLogoutUserMutation()
    const navigate = useNavigate()

    const logout = () => {
        logoutUser()
    }

    const goHome = () => {
        navigate('/')
    }

    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <h1>Whoops!</h1>
                <h1>This page is unavailable.</h1>
                <span>
                    You don't have access to this Workspace or it doesn't exist
                    anymore.
                </span>
                <button onClick={goHome} className={styles.home}>
                    Go Back Home
                </button>
                <button onClick={logout} className={styles.logout}>
                    or log out
                </button>
            </div>
        </div>
    )
}

export default WorkspaceNotFound
