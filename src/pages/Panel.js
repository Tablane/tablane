import { useEffect } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import SideBar from './panel/SideBar'
import Board from './panel/Board'
import Home from './panel/Home'
import { CircularProgress } from '@mui/material'
import useLocalStorageState from '../modules/hooks/useLocalStorageState'
import { useDispatch } from 'react-redux'
import Notifications from './panel/Notifications'
import WorkspaceNotFound from './panel/WorkspaceNotFound'
import { useFetchWorkspaceQuery } from '../modules/state/services/workspaces'
import PrivateRoute from '../utils/PrivateRoute'

function Panel(props) {
    const params = useParams()
    const {
        data: workspace,
        error,
        isLoading
    } = useFetchWorkspaceQuery(params.workspace)
    const [sidebarOpen, setSidebarOpen] = useLocalStorageState(
        'sidebarOpen',
        true
    )

    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    if (error) return <WorkspaceNotFound />
    if (isLoading) {
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    }
    return (
        <div className={`App ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
            <SideBar
                history={props.history}
                url={'/' + params.workspace}
                toggleSideBar={toggleSideBar}
                sideBarClosed={!sidebarOpen}
            />
            <div className={`PanelContent ${sidebarOpen ? 'hidden' : ''}`}>
                <Routes>
                    <PrivateRoute
                        path="/:space/:board"
                        element={
                            <Board
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <PrivateRoute
                        path="/:space/:board/:taskId"
                        element={
                            <Board
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <PrivateRoute
                        index
                        element={
                            <Home
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <PrivateRoute
                        path="/notifications"
                        element={
                            <Notifications
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <PrivateRoute
                        path="/:workspace"
                        element={
                            <Navigate to={localStorage.getItem('lastUrl')} />
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

export default Panel
