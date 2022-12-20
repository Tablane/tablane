import { MouseEventHandler, useState } from 'react'

function usePopoverState(initialVal: boolean = false) {
    const [state, setState] = useState(initialVal)

    const open = (e): void => {
        setState(e.currentTarget)
    }

    const close = (): void => {
        setState(false)
    }

    return [state, open, close]
}

export default usePopoverState
