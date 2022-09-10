import { useEffect } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import SideBar from './panel/SideBar'
import Board from './panel/Board'
import Home from './panel/Home'
import { CircularProgress } from '@mui/material'
import useLocalStorageState from '../modules/hooks/useLocalStorageState'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWorkspace } from '../modules/state/reducers/workspaceReducer'
import Notifications from './panel/Notifications'

function Panel(props) {
    const { workspace } = useSelector(state => state.workspace)
    const [sidebarOpen, setSidebarOpen] = useLocalStorageState(
        'sidebarOpen',
        true
    )
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        dispatch(fetchWorkspace(params.workspace))
    }, [])

    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return !workspace ? (
        <div className="loading">
            <CircularProgress />
        </div>
    ) : (
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
                    <Route path="/:workspace" element={<Navigate to={'/'} />} />
                </Routes>
            </div>
        </div>
    )
}

export default Panel
