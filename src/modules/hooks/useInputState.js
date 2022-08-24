import { useState } from 'react'

function useInputState(initialVal = '') {
    const [state, setState] = useState(initialVal)

    const handleChange = e => {
        setState(e.target.value)
    }

    const reset = () => {
        setState(initialVal)
    }

    return [state, handleChange, reset, setState]
}

export default useInputState
