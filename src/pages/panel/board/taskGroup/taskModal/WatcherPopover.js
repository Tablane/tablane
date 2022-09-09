import { Popover } from '@mui/material'
import styles from '../../../../../styles/WatcherPopover.module.scss'
import { useSelector } from 'react-redux'

function WatcherPopover({ task, anchor, setAnchor }) {
    const { workspace } = useSelector(state => state.workspace)

    const handleClose = () => {
        setAnchor(false)
    }

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
                    <input type="text" placeholder={'Search...'} />
                </div>
                <div className={styles.userList}>
                    {workspace.members.map(member => (
                        <div className={styles.user} key={member.user._id}>
                            <div className={styles.profileWrapper}>
                                <div>
                                    {member.user.username
                                        .charAt(0)
                                        .toUpperCase()}
                                    {member.user.username
                                        .charAt(1)
                                        .toUpperCase()}
                                </div>
                            </div>
                            <span className={styles.name}>
                                {member.user.username}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Popover>
    )
}

export default WatcherPopover
