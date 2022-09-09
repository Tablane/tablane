import { Popover } from '@mui/material'
import styles from '../../../../../styles/WatcherPopover.module.scss'
import { useSelector } from 'react-redux'
import useInputState from '../../../../../modules/hooks/useInputState'

function WatcherPopover({ task, anchor, setAnchor }) {
    const { workspace } = useSelector(state => state.workspace)
    const { user } = useSelector(state => state.user)
    const [search, handleSearch] = useInputState('')

    const handleClose = () => {
        setAnchor(false)
    }

    const userSearch = user => {
        return user.username.toUpperCase().includes(search.toUpperCase())
    }

    const isWatcher = Boolean(task.watcher.find(x => x._id === user._id))
    return (
        <Popover
            className={styles.popover}
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
        >
            <div className={styles.container}>
                <div className={styles.search}>
                    <div className={styles.icon}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input
                        value={search}
                        onChange={handleSearch}
                        type="text"
                        placeholder={'Search...'}
                    />
                </div>
                <div className={styles.userList}>
                    {userSearch(user) && (
                        <div
                            className={`${styles.user} ${
                                isWatcher ? styles.isWatcher : null
                            }`}
                            key={user._id}
                        >
                            <div className={styles.profileWrapper}>
                                <div>
                                    {user.username.charAt(0).toUpperCase()}
                                    {user.username.charAt(1).toUpperCase()}
                                </div>
                            </div>
                            <span className={styles.name}>{user.username}</span>
                        </div>
                    )}

                    {task.watcher
                        .filter(localUser => localUser._id !== user._id)
                        .filter(user => userSearch(user))
                        .map(user => (
                            <div
                                className={styles.user + ' ' + styles.isWatcher}
                                key={user._id}
                            >
                                <div className={styles.profileWrapper}>
                                    <div>
                                        {user.username.charAt(0).toUpperCase()}
                                        {user.username.charAt(1).toUpperCase()}
                                    </div>
                                </div>
                                <span className={styles.name}>
                                    {user.username}
                                </span>
                            </div>
                        ))}

                    {workspace.members
                        .filter(({ user: localUser }) => {
                            const isCurrentUser = localUser._id === user._id
                            const isWatcher = task.watcher.find(
                                x => x._id === localUser._id
                            )
                            return !(isCurrentUser || isWatcher)
                        })
                        .filter(({ user }) => userSearch(user))
                        .map(({ user }) => (
                            <div className={styles.user} key={user._id}>
                                <div className={styles.profileWrapper}>
                                    <div>
                                        {user.username.charAt(0).toUpperCase()}
                                        {user.username.charAt(1).toUpperCase()}
                                    </div>
                                </div>
                                <span className={styles.name}>
                                    {user.username}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </Popover>
    )
}

export default WatcherPopover
