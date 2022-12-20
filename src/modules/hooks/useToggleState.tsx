import { useState } from 'react'

function useToggleState(initialVal: boolean = false) {
    const [state, setState] = useState(initialVal)

    const toggle = (): void => {
        setState(!state)
    }

    const reset = (): void => {
        setState(initialVal)
    }

    return [state, toggle, reset, setState]
}

export default useToggleState
