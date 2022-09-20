import { Popover } from '@mui/material'
import styles from '../../../../../styles/WatcherPopover.module.scss'
import useInputState from '../../../../../modules/hooks/useInputState'
import {
    useAddWatcherMutation,
    useRemoveWatcherMutation
} from '../../../../../modules/services/boardSlice'
import { useFetchUserQuery } from '../../../../../modules/services/userSlice'
import { useFetchWorkspaceQuery } from '../../../../../modules/services/workspaceSlice'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function WatcherPopover({ task, anchor, setAnchor, boardId }) {
    const params = useParams()
    const { data: user } = useFetchUserQuery()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const [search, handleSearch] = useInputState('')
    const [addWatcher] = useAddWatcherMutation()
    const [removeWatcher] = useRemoveWatcherMutation()

    const handleClose = () => {
        setAnchor(false)
    }

    const handleClick = (user, isWatcher) => {
        if (isWatcher) {
            removeWatcher({ task: task, user: user, boardId })
        } else {
            addWatcher({ task: task, user: user, boardId })
        }
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
                        <FontAwesomeIcon icon={solid('magnifying-glass')} />
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
                            onClick={() => handleClick(user, isWatcher)}
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
                                onClick={() => handleClick(user, true)}
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
                            <div
                                className={styles.user}
                                key={user._id}
                                onClick={() => handleClick(user, false)}
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
                </div>
            </div>
        </Popover>
    )
}

export default WatcherPopover
