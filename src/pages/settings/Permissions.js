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
            name: 'Read Public Items',
            description:
                'Gives the user the permission to read public spaces, board and tasks.',
            key: 'READ:PUBLIC'
        },
        {
            name: 'Create Tasks',
            description: 'Gives the user the permission to add Tasks.',
            key: 'CREATE:TASK'
        },
        {
            name: 'Delete Tasks',
            description: 'Gives the user the permission to delete Tasks.',
            key: 'DELETE:TASK'
        },
        {
            name: 'Edit Columns',
            description: 'Gives the user the permission to edit Column values.',
            key: 'MANAGE:COLUMN_VALUE'
        },
        {
            name: 'Manage Boards',
            description:
                'Gives the user the permission to create, edit, and delete boards.',
            key: 'MANAGE:BOARD'
        },
        {
            name: 'Manage Spaces',
            description:
                'Gives the user the permission to create, edit, and delete spaces.',
            key: 'MANAGE:SPACE'
        },
        // {
        //     name: 'Git',
        //     description:
        //         'Allows the user to see and open the Github/Bitbucket/Gitlab modal on tasks and use all the features within it.',
        //     key: 'MANAGE:INTEGRATION_GIT'
        // },
        {
            name: 'Manage Columns',
            description:
                'Gives the user the permission to create, edit, and delete columns.',
            key: 'MANAGE:COLUMN'
        },
        {
            name: 'Manage Members',
            description:
                'Gives the user the permission to add or remove members to the Workspace.',
            key: 'MANAGE:MEMBER'
        },
        {
            name: 'Manage Workspace',
            description:
                'Gives the user the permission to change Workspace level permissions',
            key: 'MANAGE:WORKSPACE'
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
