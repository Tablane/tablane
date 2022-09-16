import { Navigate } from 'react-router-dom'

function FunctionAndNavigate({ to, fn }) {
    fn()

    return <Navigate to={to} />
}

export default FunctionAndNavigate
