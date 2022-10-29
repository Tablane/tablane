import './App.css'
import { lazy, Suspense } from 'react'
import { Outlet, Route, Navigate, Routes } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoute'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './modules/services/authReducer'
import { useFetchUserQuery } from './modules/services/userSlice'
import { CircularProgress } from '@mui/material'
import ErrorPage from './utils/ErrorPage'
const Register = lazy(() => import('./pages/auth/Register'))
const Login = lazy(() => import('./pages/auth/Login'))
const WorkspaceSelector = lazy(() => import('./pages/WorkspaceSelector'))
const Settings = lazy(() => import('./pages/Settings'))
const Workspace = lazy(() => import('./pages/Workspace'))

function PrivateRouter() {
    const { isLoading, error } = useFetchUserQuery()
    const token = useSelector(selectCurrentToken)

    if (isLoading) {
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        )
    } else if (error?.status) {
        if (error.status === 'FETCH_ERROR') return <ErrorPage error={error} />
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
                    <Route
                        path="/login"
                        element={
                            <Suspense fallback={loading}>
                                <Login />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <Suspense fallback={loading}>
                                <Register />
                            </Suspense>
                        }
                    />
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
