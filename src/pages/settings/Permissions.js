import styles from '../../styles/Permissions.module.scss'
import { Switch } from '@mui/material'
import {
    useChangePermissionMutation,
    useFetchWorkspaceQuery
} from '../../modules/services/workspaceSlice'
import { useParams } from 'react-router-dom'

function Permissions() {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const [changePermission] = useChangePermissionMutation()

    const permissions = [
        {
            name: 'Add/Remove Members',
            description:
                'Gives the user the permission to add or remove members to the Workspace.',
            key: 'MODIFY:MEMBERS'
        },
        {
            name: 'Git',
            description:
                'Allows the user to see and open the Github/Bitbucket/Gitlab modal on tasks and use all the features within it.',
            key: 'USE:GIT'
        },
        {
            name: 'Edit Statuses',
            description:
                'Gives the user the permission to create, edit, and delete statuses. If you have Edit Statuses toggled on, but Delete Items off, you will not be able to delete statuses.',
            key: 'MODIFY:STATUS'
        }
    ]

    const handleChange = (roleId, key) => {
        changePermission({
            workspace,
            roleId,
            key
        })
    }

    return (
        <div className={styles.root}>
            <p className={styles.title}>Advanced permissions</p>
            <div className={styles.permissionList}>
                <div className={styles.tableHead}>
                    <div>
                        <p>Actions</p>
                    </div>
                    {workspace.roles.map(role => (
                        <div key={role._id}>
                            <p>{role.name}</p>
                        </div>
                    ))}
                </div>
                {permissions.map(permission => (
                    <div key={permission.key}>
                        <div className={styles.action}>
                            <p className={styles.actionTitle}>
                                {permission.name}
                            </p>
                            <span className={styles.actionDescription}>
                                {permission.description}
                            </span>
                        </div>
                        {workspace.roles.map(role => (
                            <div key={role._id}>
                                <Switch
                                    size="small"
                                    checked={role.permissions.includes(
                                        permission.key
                                    )}
                                    onClick={() =>
                                        handleChange(role._id, permission.key)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Permissions
