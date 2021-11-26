import {useState} from "react";

function useToggleState(initialVal = false) {
    const [state, setState] = useState(initialVal)

    const toggle = () => {
        setState(!state)
    }

    const reset = () => {
        setState(initialVal)
    }

    return [state, toggle, reset, setState]
}

export default useToggleState