import { Popover } from '@mui/material'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useContext } from 'react'
import WorkspaceContext from '../../../modules/context/WorkspaceContext'
import styles from '../../../styles/RolePopup.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function RolePopup(props) {
    const { workspace, getData } = useContext(WorkspaceContext)

    const changeRole = (id, role) => {
        axios({
            method: 'PATCH',
            withCredentials: true,
            data: {
                role: role
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/user/${workspace._id}/${id}`
        })
            .then(res => {
                getData()
            })
            .catch(x => {
                toast(x)
            })
    }

    const setRole = e => {
        const role = e.currentTarget.id
        if (props.anchor.id) {
            changeRole(props.anchor.id, role)
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
                    <div onClick={setRole} id="Guest">
                        <p>Guest</p>
                        {props.cRole === 'guest' && (
                            <FontAwesomeIcon icon={solid('check')} />
                        )}
                    </div>
                    <div onClick={setRole} id="Member">
                        <p>Member</p>
                        {props.cRole === 'member' && (
                            <FontAwesomeIcon icon={solid('check')} />
                        )}
                    </div>
                    <div onClick={setRole} id="Admin">
                        <p>Admin</p>
                        {(props.cRole === 'admin' ||
                            props.cRole === 'owner') && (
                            <FontAwesomeIcon icon={solid('check')} />
                        )}
                    </div>
                </div>
            </Popover>
        </div>
    )
}

export default RolePopup
