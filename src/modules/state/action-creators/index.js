import axios from "axios";
import {toast} from "react-hot-toast";

export const getCurrentUser = (payload) => {
    return dispatch => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/user`
        }).then(res => {
            dispatch({
                type: 'SET_USER',
                payload: { user: res.data.user, loading: false }
            })
        }).catch(err => {
            dispatch({
                type: 'SET_USER',
                payload: { loading: false }
            })
        })
    }
}

export const userLogin = (payload) => {
    const { username, password } = payload
    return (dispatch) => {
        dispatch({
            type: 'SET_USER',
            payload: { submitting: true }
        })
        axios({
            method: "POST",
            data: {
                username: username,
                password: password,
            },
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/login`,
        }).then((res) => {
            if (res.data.success) {
                dispatch({
                    type: 'SET_USER',
                    payload: { user: res.data.user, submitting: false }
                })
                toast('Successfully logged in')
            } else {
                dispatch({
                    type: 'SET_USER',
                    payload: { submitting: false }
                })
                res.data.error.map(x => toast(x))
            }
        }).catch(err => {
            toast(err)
            dispatch({
                type: 'SET_USER',
                payload: { submitting: false }
            })
        })
    }
}

export const userRegister = (payload) => {
    const { username, password, email } = payload
    return dispatch => {
        dispatch({
            type: 'SET_USER',
            payload: { submitting: true }
        })
        axios({
            method: "POST",
            data: { username, password, email },
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/register`,
        }).then((res) => {
            console.log(res.data)
            toast('Successfully registered')
            if (res.data.success) {
                dispatch({
                    type: 'SET_USER',
                    payload: { user: res.data.user, submitting: true }
                })
            } else {
                res.data.error.map(x => toast(x))
                dispatch({
                    type: 'SET_USER',
                    payload: { user: res.data.user, submitting: true }
                })
            }
        }).catch(err => toast(err))
    }
}

export const userLogout = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'LOGOUT_USER' })
        axios({
            method: "GET",
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/logout`,
        }).then((res) => {
            toast(res.data)
        }).catch(x => {
            toast(x)
        })
    }
}