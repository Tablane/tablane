import './App.css'
import { Route, Routes } from 'react-router-dom'
import ErrorPage from './utils/ErrorPage'
import PrivateRouter from './PrivateRouter'
import SharedView from './pages/SharedView'

function App() {
    return (
        <Routes>
            <Route path="/shared/view/:viewId" element={<SharedView />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<PrivateRouter />} />
        </Routes>
    )
}

export default App
