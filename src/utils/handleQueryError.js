import { toast } from 'react-hot-toast'

function handleQueryError({ err, silent = false }) {
    if (err.error.status === 'FETCH_ERROR') {
        toast('Cannot connect to server')
    } else if (
        err.error.data.friendlyError ||
        err.error.data.message.includes(
            'You do not have permissions to perform this action:'
        )
    ) {
        toast(err.error.data.message)
    } else if (err.error.data.silentError) {
        return true
    } else if (!silent) {
        console.log(err)
        toast('Something went wrong')
    }

    return true
}

export default handleQueryError
