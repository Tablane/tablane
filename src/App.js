import './App.css'
import { Route, Routes } from 'react-router-dom'
import ErrorPage from './utils/ErrorPage'
import PrivateRouter from './PrivateRouter'
import SharedBoard from './pages/SharedBoard'

function App() {
    return (
        <Routes>
            <Route path="/shared/board/:boardId" element={<SharedBoard />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<PrivateRouter />} />
        </Routes>
    )
}

export default App
