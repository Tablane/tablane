import { Route, Routes, useParams } from 'react-router-dom'
import SideBar from './workspace/SideBar'
import Home from './workspace/Home.tsx'
import useLocalStorageState from '../modules/hooks/useLocalStorageState.tsx'
import Notifications from './workspace/Notifications.tsx'
import WorkspaceNotFound from './workspace/WorkspaceNotFound'
import { useFetchWorkspaceQuery } from '../modules/services/workspaceSlice'
import FunctionAndNavigate from '../utils/FunctionAndNavigate'
import { toast } from 'react-hot-toast'
import View from './workspace/View'
import LoadingPage from '../utils/LoadingPage.tsx'

function Workspace(props) {
    const params = useParams()
    const {
        data: workspace,
        error,
        isFetching
    } = useFetchWorkspaceQuery(params.workspace)
    const [sidebarOpen, setSidebarOpen] = useLocalStorageState(
        'sidebarOpen',
        true
    )

    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    if (error) return <WorkspaceNotFound />
    if (isFetching) {
        return <LoadingPage />
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
                            <View
                                view="list"
                                level="list"
                                sidebarOpen={sidebarOpen}
                                toggleSideBar={toggleSideBar}
                            />
                        }
                    />
                    <Route
                        path="/:space/:board/:taskId"
                        element={
                            <View
                                view="list"
                                level="list"
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
