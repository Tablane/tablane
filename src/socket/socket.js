import { io } from 'socket.io-client'

let socket
if (localStorage.getItem('access_token')) {
    socket = io(process.env.REACT_APP_BACKEND_HOST, {
        transportOptions: {
            polling: {
                extraHeaders: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'access_token'
                    )}`
                }
            }
        }
    })
}

export default socket
