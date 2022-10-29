import { Popover } from '@mui/material'
import styles from '../../../styles/RolePopup.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useParams } from 'react-router-dom'
import {
    useChangeRoleMutation,
    useFetchWorkspaceQuery
} from '../../../modules/services/workspaceSlice'

function RolePopup(props) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const [changeRole] = useChangeRoleMutation()

    const handleChangeRole = (userId, role) => {
        changeRole({ workspace, userId, role })
    }

    const setRole = e => {
        const role = e.currentTarget.id
        if (props.anchor.id) {
            handleChangeRole(props.anchor.id, role)
        } else {
            props.setRole(role)
        }
        props.close()
    }

    return (
        <div>
            <Popover
                open={Boolean(props.anchor)}
                anchorEl={props.anchor}
                onClose={props.close}
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
                    {workspace.roles.map(role => {
                        return (
                            <div onClick={setRole} id={role._id} key={role._id}>
                                <p>{role.name}</p>
                                {props.cRole === role._id && (
                                    <FontAwesomeIcon icon={solid('check')} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </Popover>
        </div>
    )
}

export default RolePopup
