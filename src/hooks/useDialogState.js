import {useState} from "react";

function useDialogState(initialVal = false) {
    const [state, setState] = useState(initialVal)

    const handleChange = e => {
        setState(!state)
    }

    return [state, handleChange]
}

export default useDialogState