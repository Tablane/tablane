import './App.css'
import { CircularProgress } from '@mui/material'
import Workspace from './pages/Workspace'
import { Route, Routes } from 'react-router-dom'
import WorkspaceSelector from './pages/WorkspaceSelector'
import SharedBoard from './pages/SharedBoard'
import Settings from './pages/Settings'
import { useFetchUserQuery } from './modules/services/userSlice'
import PrivateRoutes from './utils/PrivateRoute'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import ErrorPage from './utils/ErrorPage'

function App() {
    const { data: user, error, isLoading } = useFetchUserQuery()

    if (isLoading)
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    if (error) {
        return <ErrorPage error={error} />
    }
    return (
        <Routes>
            <Route path="/share/:boardId" element={<SharedBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoutes />}>
                <Route path="/settings/:workspace/*" element={<Settings />} />
                <Route path="/:workspace/*" element={<Workspace />} />
                <Route
                    index
                    element={<WorkspaceSelector workspaces={user.workspaces} />}
                />
            </Route>
        </Routes>
    )
}

export default App
