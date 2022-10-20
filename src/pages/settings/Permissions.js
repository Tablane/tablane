import styles from '../../styles/Permissions.module.scss'
import { Switch } from '@mui/material'

function Permissions() {
    return (
        <div className={styles.root}>
            <p className={styles.title}>Advanced permissions</p>
            <div className={styles.permissionList}>
                <div className={styles.tableHead}>
                    <div>
                        <p>Actions</p>
                    </div>
                    <div>
                        <p>Guest</p>
                    </div>
                    <div>
                        <p>Member</p>
                    </div>
                    <div>
                        <p>Admin</p>
                    </div>
                </div>
                <div>
                    <div className={styles.action}>
                        <p className={styles.actionTitle}>Add/Remove Members</p>
                        <span className={styles.actionDescription}>
                            Gives the user the permission to add or remove
                            members to the Workspace.
                        </span>
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                </div>
                <div>
                    <div className={styles.action}>
                        <p className={styles.actionTitle}>Manage Fields</p>
                        <span className={styles.actionDescription}>
                            Allows the user to see and open the
                            Github/Bitbucket/Gitlab modal on tasks and use all
                            the features within it.
                        </span>
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                </div>
                <div>
                    <div className={styles.action}>
                        <p className={styles.actionTitle}>Invite Guests</p>
                        <span className={styles.actionDescription}>
                            Gives the user the permission to create, edit, and
                            delete statuses. If you have Edit Statuses toggled
                            on, but Delete Items off, you will not be able to
                            delete statuses.
                        </span>
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                    <div>
                        <Switch size="small" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Permissions
