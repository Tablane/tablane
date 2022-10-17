import './App.css'
import Workspace from './pages/Workspace'
import { Outlet, Route, Navigate, Routes } from 'react-router-dom'
import WorkspaceSelector from './pages/WorkspaceSelector'
import Settings from './pages/Settings'
import PrivateRoutes from './utils/PrivateRoute'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './modules/services/authReducer'
import { useFetchUserQuery } from './modules/services/userSlice'
import { CircularProgress } from '@mui/material'

function PrivateRouter() {
    const { isLoading } = useFetchUserQuery()
    const token = useSelector(selectCurrentToken)

    if (isLoading) {
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    }

    return (
        <>
            <Routes>
                <Route element={token ? <Navigate to="/" /> : <Outlet />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<PrivateRoutes />}>
                    <Route
                        path="/settings/:workspace/*"
                        element={<Settings />}
                    />
                    <Route path="/:workspace/*" element={<Workspace />} />
                    <Route index element={<WorkspaceSelector />} />
                </Route>
            </Routes>
        </>
    )
}

export default PrivateRouter
