import { Navigate, Outlet } from 'react-router-dom'
import { useFetchUserQuery } from '../modules/state/services/userSlice'

const PrivateRoutes = () => {
    const { data: user } = useFetchUserQuery()
    return user?.username ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
