import './App.css'
import Workspace from './pages/Workspace'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import WorkspaceSelector from './pages/WorkspaceSelector'
import SharedBoard from './pages/SharedBoard'
import Settings from './pages/Settings'
import PrivateRoutes from './utils/PrivateRoute'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'

function App() {
    return (
        <Routes>
            <Route path="/share/:boardId" element={<SharedBoard />} />
            <Route
                element={
                    'user'?.username === 'x' ? <Navigate to="/" /> : <Outlet />
                }
            >
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
