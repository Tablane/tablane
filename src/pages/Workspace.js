import { Navigate, Route, Routes, useParams, Outlet } from 'react-router-dom'
import SideBar from './workspace/SideBar'
import Board from './workspace/Board'
import Home from './workspace/Home'
import { CircularProgress } from '@mui/material'
import useLocalStorageState from '../modules/hooks/useLocalStorageState'
import Notifications from './workspace/Notifications'
import WorkspaceNotFound from './workspace/WorkspaceNotFound'
import { useFetchWorkspaceQuery } from '../modules/state/services/workspaceSlice'
import FunctionAndNavigate from '../utils/FunctionAndNavigate'
import { toast } from 'react-hot-toast'

function Workspace(props) {
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
                    <Route
                        path="/:space/:board"
                        element={
                            <Board
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <Route
                        path="/:space/:board/:taskId"
                        element={
                            <Board
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <Route
                        index
                        element={
                            <Home
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <Notifications
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <Route
                        path="/*"
                        element={
                            <FunctionAndNavigate
                                to={`/${workspace.id}`}
                                fn={() => toast('Could not find that Board')}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

export default Workspace
