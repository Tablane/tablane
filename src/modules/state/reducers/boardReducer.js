const reducer = (state = { board: null, loading: true, submitting: false }, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return { ...state, ...action.payload }
        case 'REMOVE_BOARD':
            return { ...state, board: null, loading: false, submitting: false }
        default:
            return state
    }
}

export default reducer