import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../modules/services/authReducer'

const PrivateRoutes = () => {
    const token = useSelector(selectCurrentToken)
    return token ? <Outlet /> : <Navigate to="/login" replace={true} />
}

export default PrivateRoutes
