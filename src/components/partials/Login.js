import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {CircularProgress} from "@material-ui/core";
import './assets/Login.css'
import useInputState from "../../hooks/useInputState";
import UserContext from "../../context/UserContext";

function Login(props) {
    const [loading, setLoading] = useState(false)
    const {setUser} = useContext(UserContext)
    const [validate, setValidate] = useState(false)

    const [username, changeUsername] = useInputState()
    const [password, changePassword] = useInputState()

    const [errors, setErrors] = useState({})

    const loginUser = async () => {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                data: {
                    username: username,
                    password: password,
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/login`,
            }).then((res) => {
                if (res.data.success) resolve(res.data.user)
                else reject(res.data)
            }).catch(err => {
                toast(err.toString())
                setLoading(false)
            })
        })
    }

    const validateInput = useCallback(() => {
        let errors = {}

        if (username === '') errors.username = 'This field is required'
        else if (username.length < 3)
            errors.username = 'Username must be longer than 3 characters'

        // if (email === "") errors.email = "This field is required"
        // else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))
        //     errors.email = 'Email is invalid'

        if (password === '') errors.password = 'This field is required'
        else if (password.length < 3)
            errors.password = 'Password must be longer than 3 characters'

        setErrors(errors)
        return Object.keys(errors).length === 0;
    }, [username, password])

    useEffect(() => {
        if (validate) validateInput()
    }, [username, password, validate, validateInput])

    const handleSubmit = (e) => {
        e.preventDefault()
        setValidate(true)
        if (validateInput()) {
            setLoading(true)
            loginUser()
                .then(user => {
                    toast('Successfully logged in')
                    setUser(user)
                })
                .catch(x => {
                    x.error.map(x => toast(x))
                    setLoading(false)
                })
        }
    }

    return (
        <div className="form">
            <div>
                <form action="" onSubmit={handleSubmit} noValidate>
                    <div className="inputs">
                        <TextField
                            id="username"
                            name="username"
                            label="Username"
                            value={username}
                            onChange={changeUsername}
                            error={Boolean(errors.username)}
                            helperText={errors.username}
                            required/>
                        <TextField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={changePassword}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required/>
                    </div>
                    <div className="progressWrapper">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}>Login</Button>
                        {loading && <CircularProgress size={24} className="buttonProgress"/>}
                    </div>
                </form>
            </div>
            <p>or <Link to="/register">sign up</Link></p>
        </div>
    );

}

export default Login