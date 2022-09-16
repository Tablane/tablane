import { Navigate, Outlet } from 'react-router-dom'
import { useFetchUserQuery } from '../modules/state/services/users'

const PrivateRoutes = () => {
    const { data: user } = useFetchUserQuery()
    return user.token ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
