const initialState = {
    isLoggedIn: false,
    workspaces: null,
    board: null,
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'changeLoggedIn':
            return {
                ...state,
                isLoggedIn: action.payload
            }
        case 'setData': {
            return {
                ...state,
                [action.payload[0]]: action.payload[1]
            }
        }
        default:
            return state
    }
}

