import styles from '../../styles/Profile.module.scss'

function Profile() {
    return (
        <div>
            <p className={styles.title}>My Settings</p>
            <div className={styles.username}></div>
        </div>
    )
}

export default Profile
