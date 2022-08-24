import { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import '../styles/Auth.css'

class Auth extends Component {
    render() {
        return (
            <div className="Auth">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        )
    }
}

export default Auth
