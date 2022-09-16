import './App.css'
import Auth from './pages/Auth'
import { CircularProgress } from '@mui/material'
import Panel from './pages/Panel'
import { Route, Routes, Navigate } from 'react-router-dom'
import WorkspaceSelector from './pages/WorkspaceSelector'
import SharedBoard from './pages/SharedBoard'
import Settings from './pages/Settings'
import ContextProvider from './ContextProvider'
import SyncError from './pages/SyncError'
import { useFetchUserQuery } from './modules/state/services/users'
import PrivateRoute from './utils/PrivateRoute'

function App() {
    const { data: user, error, isLoading } = useFetchUserQuery()

    if (isLoading)
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    return (
        <ContextProvider>
            <Routes>
                <Route path="/share/:boardId" element={<SharedBoard />} />
                <Route path="/*" element={<Auth />} />
                <Route path="/login" element={<Navigate to={'/'} />} />
                <Route path="/register" element={<Navigate to={'/'} />} />
                <PrivateRoute
                    path="/settings/:workspace/*"
                    element={<Settings />}
                />
                <PrivateRoute path="/:workspace/*" element={<Panel />} />
                <PrivateRoute
                    path="/"
                    element={<WorkspaceSelector workspaces={user.workspaces} />}
                />
            </Routes>
            <SyncError />
        </ContextProvider>
    )
}

export default App
