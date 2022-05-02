const reducer = (state = { user: null, loading: true, submitting: false }, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, ...action.payload }
        case 'LOGOUT_USER':
            return { ...state, user: null, loading: false, submitting: false }
        default:
            return state
    }
}

export default reducer