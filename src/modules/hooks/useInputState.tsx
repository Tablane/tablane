import { ChangeEvent, useState } from 'react'

function useInputState(initialVal: string = '') {
    const [state, setState] = useState(initialVal)

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setState(e.target.value)
    }

    const reset = (): void => {
        setState(initialVal)
    }

    return [state, handleChange, reset, setState]
}

export default useInputState
