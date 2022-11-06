import { Popover } from '@mui/material'
import styles from '../../../../../../styles/WatcherPopover.module.scss'
import useInputState from '../../../../../../modules/hooks/useInputState'
import { useEditOptionsTaskMutation } from '../../../../../../modules/services/boardSlice'
import { useFetchWorkspaceQuery } from '../../../../../../modules/services/workspaceSlice'
import { useFetchUserQuery } from '../../../../../../modules/services/userSlice'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function PersonColumnPopover({
    boardId,
    task,
    anchor,
    handleClose,
    attribute,
    taskOption,
    people
}) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data: user } = useFetchUserQuery()
    const [search, handleSearch] = useInputState('')
    const [editOptionsTask] = useEditOptionsTaskMutation()

    const handleClick = (user, isAssignee) => {
        if (isAssignee) {
            editOptionsTask({
                column: attribute._id,
                value: taskOption.value.filter(x => x !== user._id),
                type: 'person',
                boardId,
                taskId: task._id
            })
        } else {
            let value = [user._id]
            if (taskOption) value = [...taskOption.value, user._id]
            editOptionsTask({
                column: attribute._id,
                value,
                type: 'person',
                boardId,
                taskId: task._id
            })
        }
    }

    const userSearch = user => {
        return user.username.toUpperCase().includes(search.toUpperCase())
    }

    const isAssignee = Boolean(taskOption?.value.includes(user._id))
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
                                isAssignee ? styles.isWatcher : null
                            }`}
                            key={user._id}
                            onClick={() => handleClick(user, isAssignee)}
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

                    {people
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
                            const isAssignee = people.find(
                                x => x._id === localUser._id
                            )
                            return !(isCurrentUser || isAssignee)
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

export default PersonColumnPopover
