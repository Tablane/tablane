import axios from "axios";
import {toast} from "react-hot-toast";

export const userLogin = (payload) => {
    return (dispatch) => {
        axios({
            method: "POST",
            data: {
                username: "game",
                password: "",
            },
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/login`,
        }).then((res) => {
            dispatch({
                type: 'userLogin',
                payload
            })
        }).catch(err => {
            toast(err.toString())
        })
    }
}

export const userLogout = (payload) => {
    return (dispatch) => {
        axios({
            method: "GET",
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/logout`,
        }).then((res) => {
            toast(res.data)
        }).catch(x => {
            toast(x)
        })
        dispatch({ type: 'userLogout' })
    }
}