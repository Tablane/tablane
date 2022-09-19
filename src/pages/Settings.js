import { CircularProgress } from '@mui/material'
import {
    Link,
    NavLink,
    Navigate,
    Route,
    Routes,
    useParams
} from 'react-router-dom'
import General from './settings/General'
import Import from './settings/Import'
import Apps from './settings/Apps'
import Billing from './settings/Billing'
import Trash from './settings/Trash'
import Integrations from './settings/Integrations'
import Users from './settings/Users'
import Permissions from './settings/Permissions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import WorkspaceContext from '../modules/context/WorkspaceContext'
import styles from '../styles/Settings.module.scss'
import {
    useFetchUserQuery,
    useLogoutUserMutation
} from '../modules/services/userSlice'

function Settings(props) {
    const [logoutUser] = useLogoutUserMutation()
    const [workspace, setWorkspace] = useState(null)
    const { data: user } = useFetchUserQuery()
    const params = useParams()

    const getData = useCallback(async () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/${params.workspace}`
        })
            .then(res => {
                setWorkspace(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [params.workspace])

    useEffect(() => {
        getData()
    }, [getData])

    const providerValue = useMemo(
        () => ({ workspace, getData }),
        [workspace, getData]
    )

    if (!workspace)
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Link to={`/${workspace.id}`} className={styles.back}>
                    <i className="fas fa-chevron-left"> </i>Back
                </Link>
                <h1>Settings</h1>
                <p className={styles.workspaceName}>{workspace.name}</p>
                <div className={styles.settings}>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/general`}
                    >
                        Settings
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/users`}
                    >
                        People
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/import`}
                    >
                        Import/Export
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/apps`}
                    >
                        Apps
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/integrations`}
                    >
                        Integrations
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/billing`}
                    >
                        Upgrade
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/trash`}
                    >
                        Trash
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/permissions`}
                    >
                        Security & Permissions
                    </NavLink>

                    <div className={styles.divider}></div>
                    <p className={styles.userName}>{user.username}</p>

                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/profile`}
                    >
                        My Settings
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/workspaces`}
                    >
                        Workspaces
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/notifications`}
                    >
                        Notifications
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/applications`}
                    >
                        Apps
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? styles.active : ''
                        }
                        to={`/settings/${workspace.id}/logout`}
                        onClick={() => logoutUser()}
                    >
                        Log out
                    </NavLink>
                </div>
            </div>

            <WorkspaceContext.Provider value={providerValue}>
                <div className={styles.content}>
                    <Routes>
                        <Route path={`/general`} element={<General />} />
                        <Route path={`/users`} element={<Users />} />
                        <Route path={`/import`} element={<Import />} />
                        <Route path={`/apps`} element={<Apps />} />
                        <Route
                            path={`/integrations`}
                            element={<Integrations />}
                        />
                        <Route path={`/billing`} element={<Billing />} />
                        <Route path={`/trash`} element={<Trash />} />
                        <Route
                            path={`/permissions`}
                            element={<Permissions />}
                        />
                        <Route
                            path={`/`}
                            element={() => (
                                <Navigate
                                    to={`/settings/${workspace.id}/general`}
                                />
                            )}
                        />
                    </Routes>
                </div>
            </WorkspaceContext.Provider>
        </div>
    )
}

export default Settings
