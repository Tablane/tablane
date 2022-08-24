import { useState } from 'react'

function usePopoverState(initialVal = false) {
    const [state, setState] = useState(initialVal)

    const open = e => {
        setState(e.currentTarget)
    }

    const close = () => {
        setState(false)
    }

    return [state, open, close]
}

export default usePopoverState
