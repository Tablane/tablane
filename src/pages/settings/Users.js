import React, { Fragment, useState } from 'react'
import useInputState from '../../modules/hooks/useInputState'
import usePopoverState from '../../modules/hooks/usePopoverState'
import UserPopup from './users/UserPopup'
import RolePopup from './users/RolePopup'
import styles from '../../styles/Users.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import {
    useAddUserMutation,
    useFetchWorkspaceQuery
} from '../../modules/services/workspaceSlice'
import { useParams } from 'react-router-dom'

function Users() {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const [email, changeEmail, resetEmail] = useInputState('')
    const [role, setRole] = useState('Member')
    const [anchor, open, close] = usePopoverState(false)
    const [addRoleAnchor, addRoleOpen, addRoleClose] = usePopoverState(false)
    const [roleAnchor, roleOpen, roleClose] = usePopoverState(false)
    const [addUser] = useAddUserMutation()

    const handleAddUser = async e => {
        e.preventDefault()
        resetEmail()
        await addUser({ workspace, email, role })
    }

    return (
        <div className={styles.container}>
            <p className={styles.title}>Manage People</p>
            <div className={styles.invite}>
                <form onSubmit={handleAddUser}>
                    <input
                        placeholder="Invite by Email"
                        value={email}
                        onChange={changeEmail}
                        type="text"
                    />
                    <div onClick={addRoleOpen}>
                        <span>{role}</span>
                        <FontAwesomeIcon
                            className={
                                Boolean(addRoleAnchor) ? styles.menuOpen : ''
                            }
                            icon={solid('caret-left')}
                        />
                    </div>
                    <button>Invite</button>
                </form>
            </div>
            <div className={styles.list}>
                <div className={styles.header}>
                    <div>
                        <span>Name</span>
                        <span>Email</span>
                    </div>
                    <div>
                        <span>Role</span>
                        <span>Settings</span>
                    </div>
                </div>
                <div className={styles.rows}>
                    {workspace.members.map(x => (
                        <Fragment key={x.user._id}>
                            {anchor.id === x.user._id && (
                                <UserPopup
                                    member={x}
                                    anchor={anchor}
                                    close={close}
                                />
                            )}
                            {roleAnchor.id === x.user._id && !x.isOwner && (
                                <RolePopup
                                    anchor={roleAnchor}
                                    close={roleClose}
                                    cRole={x.role}
                                />
                            )}
                            <div className={styles.row} key={x.email}>
                                <div>
                                    <div>
                                        <span>{x.user.username}</span>
                                        <div className={styles.labels}>
                                            {x.labels.map(label => (
                                                <span
                                                    key={label}
                                                    className={`${label.toLowerCase()}`}
                                                >
                                                    {label}
                                                </span>
                                            ))}
                                            {x.isOwner && (
                                                <span className={styles.owner}>
                                                    Owner
                                                </span>
                                            )}
                                            {x.role === 'guest' && (
                                                <span
                                                    className={styles.viewOnly}
                                                >
                                                    View Only
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span>{x.user.email}</span>
                                </div>
                                <div>
                                    <span
                                        id={x.user._id}
                                        onClick={roleOpen}
                                        className={
                                            x.isOwner ? styles.noPointer : null
                                        }
                                    >
                                        {x.isOwner ? 'Owner' : x.role.name}
                                    </span>
                                    <span onClick={open} id={x.user._id}>
                                        <FontAwesomeIcon
                                            icon={solid('ellipsis-h')}
                                        />
                                    </span>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            <RolePopup
                anchor={addRoleAnchor}
                setRole={setRole}
                close={addRoleClose}
            />
        </div>
    )
}

export default Users
