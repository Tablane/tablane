import { CircularProgress, makeStyles } from '@material-ui/core'
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

const useStyles = makeStyles({
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'horizontal'
    },
    sidebar: {
        backgroundColor: '#F7F7F7',
        width: '170px',
        padding: '40px',
        '& .back': {
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '30px',
            padding: '4px 15px',
            textTransform: 'uppercase',
            color: 'white',
            letterSpacing: '.05rem',
            backgroundColor: '#4169E1',
            '& i': {
                marginRight: '5px'
            }
        },
        '& h1': {
            color: '#505050',
            margin: 0,
            paddingTop: '30px',
            fontWeight: 500,
            fontSize: '22px'
        },
        '& .workspaceName': {
            marginTop: '30px',
            marginBottom: '20px',
            color: '#4169E1',
            textTransform: 'uppercase',
            fontSize: '15px',
            fontWeight: 500
        }
    },
    settings: {
        '& a': {
            fontSize: '14px',
            fontWeight: 400,
            display: 'block',
            margin: '5px 0',
            padding: '10px 0',
            textDecoration: 'none',
            color: '#a19da8',
            '&:hover': {
                color: '#554f5f'
            }
        },
        '& .active': {
            color: '#554f5f',
            fontWeight: 700
        }
    },
    content: {
        padding: '40px',
        display: 'flex',
        flexGrow: 1
    }
})

function Settings(props) {
    const classes = useStyles()
    const [workspace, setWorkspace] = useState(null)
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
        <div className={classes.container}>
            <div className={classes.sidebar}>
                <Link to={`/${workspace.id}`} className={'back'}>
                    <i className="fas fa-chevron-left"> </i>Back
                </Link>
                <h1>Settings</h1>
                <p className={'workspaceName'}>{workspace.name}</p>
                <div className={classes.settings}>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/general`}
                    >
                        Settings
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/users`}
                    >
                        People
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/import`}
                    >
                        Import/Export
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/apps`}
                    >
                        Apps
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/integrations`}
                    >
                        Integrations
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/billing`}
                    >
                        Upgrade
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/trash`}
                    >
                        Trash
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? ' active' : ''
                        }
                        to={`/settings/${workspace.id}/permissions`}
                    >
                        Security & Permissions
                    </NavLink>
                </div>
            </div>

            <WorkspaceContext.Provider value={providerValue}>
                <div className={classes.content}>
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
