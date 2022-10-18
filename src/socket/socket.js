import { io } from 'socket.io-client'
import { toast } from 'react-hot-toast'

const socket = io(process.env.REACT_APP_BACKEND_HOST, {
    withCredentials: true
})

const sendToken = () => {
    let token = localStorage.getItem('access_token')
    socket.emit('token', { token })
}
sendToken()

socket.on('token', message => {
    if (message === 'jwt_expiring') sendToken()
})
socket.on('jwt_auth_failed', message => {
    toast(message)
})

export default socket
