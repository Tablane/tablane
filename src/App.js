import './App.css'
import Workspace from './pages/Workspace'
import { Outlet, Route, Routes, Navigate } from 'react-router-dom'
import WorkspaceSelector from './pages/WorkspaceSelector'
import SharedBoard from './pages/SharedBoard'
import Settings from './pages/Settings'
import PrivateRoutes from './utils/PrivateRoute'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import { useFetchUserQuery } from './modules/services/userSlice'
import { CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './modules/services/authReducer'

function App() {
    const token = useSelector(selectCurrentToken)
    const { data: user, isLoading } = useFetchUserQuery()

    if (isLoading)
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )

    return (
        <Routes>
            <Route path="/share/:boardId" element={<SharedBoard />} />
            <Route element={token ? <Navigate to="/" /> : <Outlet />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<PrivateRoutes />}>
                <Route path="/settings/:workspace/*" element={<Settings />} />
                <Route path="/:workspace/*" element={<Workspace />} />
                <Route index element={<WorkspaceSelector />} />
            </Route>
        </Routes>
    )
}

export default App
