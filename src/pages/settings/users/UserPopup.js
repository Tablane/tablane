import { Popover } from '@mui/material'
import { toast } from 'react-hot-toast'
import styles from '../../../styles/UserPopup.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useParams } from 'react-router-dom'
import {
    useFetchWorkspaceQuery,
    useRemoveUserMutation
} from '../../../modules/services/workspaceSlice'

function UserPopup(props) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const [removeUser] = useRemoveUserMutation()

    const copyId = () => {
        navigator.clipboard.writeText(props.member.user._id)
        toast('Copied!')
        props.close()
    }

    const handleRemoveUser = () => {
        removeUser({ workspace, userId: props.member.user._id })
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
                    {!props.member.labels.includes('Pending') && (
                        <>
                            <div onClick={copyId}>
                                <div>
                                    <FontAwesomeIcon icon={regular('clone')} />
                                </div>
                                <p>Copy Member ID</p>
                            </div>
                            {props.member.role !== 'owner' && (
                                <div onClick={handleRemoveUser}>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={solid('times')}
                                        />
                                    </div>
                                    <p>Remove</p>
                                </div>
                            )}
                        </>
                    )}
                    {props.member.labels.includes('Pending') && (
                        <>
                            <div>
                                <div>
                                    <FontAwesomeIcon icon={solid('share')} />
                                </div>
                                <p>Resend Invitation</p>
                            </div>
                            <div>
                                <div>
                                    <FontAwesomeIcon icon={solid('times')} />
                                </div>
                                <p>Cancel invite</p>
                            </div>
                        </>
                    )}
                </div>
            </Popover>
        </div>
    )
}

export default UserPopup
