import { useState } from 'react'
import { Popover, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import '../../../styles/AccountPopover.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../../modules/state/reducers/userReducer'
import { useFetchWorkspaceQuery } from '../../../modules/state/services/workspaces'
import { useFetchUserQuery } from '../../../modules/state/services/users'

function AccountPopover(props) {
    const [anchor, setAnchor] = useState(null)
    const navigate = useNavigate()
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data: user } = useFetchUserQuery()

    const dispatch = useDispatch()

    const handleClick = e => {
        setAnchor(e.currentTarget)
    }

    const handleClose = () => {
        setAnchor(null)
    }

    const changeWorkspace = id => {
        navigate(`/${id}`)
        handleClose()
    }

    const workspaceId = workspace.id
    return (
        <div>
            <Button
                style={{ borderRadius: 50, width: 30, height: 30 }}
                variant="contained"
                color="primary"
                onClick={handleClick}
            >
                {user.username.charAt(0).toUpperCase()}
            </Button>
            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <div className="popover">
                    <div>
                        <div className="workspaces">
                            {user &&
                                user.workspaces.map(x => {
                                    return (
                                        <Tooltip
                                            title={x.name}
                                            placement="right"
                                            key={x._id}
                                            arrow
                                        >
                                            <div
                                                onClick={() =>
                                                    changeWorkspace(x.id)
                                                }
                                            >
                                                {x.name.toUpperCase().charAt(0)}
                                            </div>
                                        </Tooltip>
                                    )
                                })}
                            <Tooltip
                                title={'Add Workspace'}
                                placement="right"
                                arrow
                            >
                                <div>
                                    <i className="fas fa-plus"> </i>
                                </div>
                            </Tooltip>
                        </div>
                        <div className="workspace-settings">
                            <div>
                                <div className="circle">
                                    {workspace.name.charAt(0)}
                                </div>
                                <p>{workspace.name}</p>
                            </div>
                            <div className="buttons">
                                <Link to={`/settings/${workspaceId}/general`}>
                                    Settings
                                </Link>
                                <Link to={`/settings/${workspaceId}/import`}>
                                    Import/Export
                                </Link>
                                <Link to={`/settings/${workspaceId}/users`}>
                                    People
                                </Link>
                                <Link to={`/settings/${workspaceId}/apps`}>
                                    Apps
                                </Link>
                                <Link
                                    to={`/settings/${workspaceId}/integrations`}
                                >
                                    Integrations
                                </Link>
                                <Link to={`/settings/${workspaceId}/billing`}>
                                    Upgrade
                                </Link>
                                <Link to={`/settings/${workspaceId}/trash`}>
                                    Trash
                                </Link>
                                <Link
                                    to={`/settings/${workspaceId}/permissions`}
                                >
                                    Security & Permissions
                                </Link>
                            </div>
                        </div>
                        <div className="user-settings">
                            <div>
                                <div className="circle">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <p>{user.username}</p>
                            </div>
                            <div className="buttons">
                                <Link to={`/settings/${workspaceId}/profile`}>
                                    My Settings
                                </Link>
                                <Link
                                    to={`/settings/${workspaceId}/notifications`}
                                >
                                    Notifications
                                </Link>
                                <Link to={`/settings/${workspaceId}/apps`}>
                                    Apps
                                </Link>
                                <button onClick={() => dispatch(logoutUser())}>
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="download">
                        <div>
                            <p>Download Apps</p>
                        </div>
                        <div>
                            <i className="fab fa-apple"> </i>
                            <i className="fab fa-android"> </i>
                            <i className="fas fa-desktop"> </i>
                            <i className="fab fa-chrome"> </i>
                        </div>
                    </div>
                </div>
            </Popover>
        </div>
    )
}

export default AccountPopover
