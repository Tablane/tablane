import {useEffect, useState} from "react";

function useLocalStorageState(key, initialVal = '') {
    const [state, setState] = useState(() => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialVal;
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [state, key, state.length])

    return [state, setState]
}

export default useLocalStorageState