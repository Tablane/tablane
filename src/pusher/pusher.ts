import Pusher from 'pusher-js'

const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    channelAuthorization: {
        transport: 'ajax',
        endpoint: `${process.env.REACT_APP_BACKEND_HOST}/api/pusher/auth`,
        headersProvider: () => ({
            authorization: `Bearer ${localStorage.getItem('access_token')}`
        })
    },
    enabledTransports: ['ws', 'wss']
})

export default pusher
