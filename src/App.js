import { useEffect } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './modules/state/reducers/userReducer'

function App() {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchUser())
    }, [])

    if (user.status === 'loading')
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
                {user.status === 'succeeded' && (
                    <>
                        <Route path="/login" element={<Navigate to={'/'} />} />
                        <Route
                            path="/register"
                            element={<Navigate to={'/'} />}
                        />
                        <Route
                            path="/settings/:workspace/*"
                            element={<Settings />}
                        />
                        <Route path="/:workspace/*" element={<Panel />} />
                        <Route
                            path="/"
                            element={
                                <WorkspaceSelector
                                    workspaces={user.user.workspaces}
                                />
                            }
                        />
                    </>
                )}
            </Routes>
            <SyncError />
        </ContextProvider>
    )
}

export default App
