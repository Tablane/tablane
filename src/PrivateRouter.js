import './App.css'
import { lazy, Suspense } from 'react'
import { Outlet, Route, Navigate, Routes } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoute'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './modules/services/authReducer'
import { useFetchUserQuery } from './modules/services/userSlice'
import { CircularProgress } from '@mui/material'
const WorkspaceSelector = lazy(() => import('./pages/WorkspaceSelector'))
const Settings = lazy(() => import('./pages/Settings'))
const Workspace = lazy(() => import('./pages/Workspace'))

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

    const loading = (
        <div className="loading">
            <CircularProgress />
        </div>
    )

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
                        element={
                            <Suspense fallback={loading}>
                                <Settings />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/:workspace/*"
                        element={
                            <Suspense fallback={loading}>
                                <Workspace />
                            </Suspense>
                        }
                    />
                    <Route
                        index
                        element={
                            <Suspense fallback={loading}>
                                <WorkspaceSelector />
                            </Suspense>
                        }
                    />
                </Route>
            </Routes>
        </>
    )
}

export default PrivateRouter
