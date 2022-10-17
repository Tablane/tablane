import './App.css'
import { Route, Routes } from 'react-router-dom'
import SharedBoard from './pages/SharedBoard'
import ErrorPage from './utils/ErrorPage'
import PrivateRouter from './PrivateRouter'

function App() {
    return (
        <Routes>
            <Route path="/share/:boardId" element={<SharedBoard />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<PrivateRouter />} />
        </Routes>
    )
}

export default App
