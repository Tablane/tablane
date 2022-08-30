import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import '../../styles/Login.css'
import useInputState from '../../modules/hooks/useInputState'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../modules/state/reducers/userReducer'

function Login() {
    const submit = useSelector(state => state.user.submit)
    const dispatch = useDispatch()

    const [validate, setValidate] = useState(false)

    const [username, changeUsername] = useInputState()
    const [password, changePassword] = useInputState()
    const [email, changeEmail] = useInputState()

    const [errors, setErrors] = useState({})

    const validateInput = useCallback(() => {
        let errors = {}

        if (username === '') errors.username = 'This field is required'
        else if (username.length < 3)
            errors.username = 'Username must be longer than 3 characters'

        if (email === '') errors.email = 'This field is required'
        else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))
            errors.email = 'Email is invalid'

        if (password === '') errors.password = 'This field is required'
        else if (password.length < 3)
            errors.password = 'Password must be longer than 3 characters'

        setErrors(errors)
        return Object.keys(errors).length === 0
    }, [username, email, password])

    useEffect(() => {
        if (validate) validateInput()
    }, [username, password, email, validate, validateInput])

    const handleSubmit = e => {
        e.preventDefault()
        setValidate(true)
        if (validateInput()) {
            dispatch(registerUser({ username, password, email }))
        }
    }

    return (
        <div className="form">
            <div>
                <form action="" onSubmit={handleSubmit} noValidate>
                    <div className="inputs">
                        <TextField
                            variant="standard"
                            id="username"
                            name="username"
                            label="Username"
                            value={username}
                            onChange={changeUsername}
                            error={Boolean(errors.username)}
                            helperText={errors.username}
                            required
                        />
                        <TextField
                            variant="standard"
                            id="email"
                            name="email"
                            label="Email"
                            value={email}
                            onChange={changeEmail}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            required
                        />
                        <TextField
                            variant="standard"
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={changePassword}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required
                        />
                    </div>
                    <div className="progressWrapper">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={submit === 'loading'}
                        >
                            Register
                        </Button>
                        {submit === 'loading' && (
                            <CircularProgress
                                size={24}
                                className="buttonProgress"
                            />
                        )}
                    </div>
                </form>
            </div>
            <p>
                or <Link to="/login">login</Link>
            </p>
        </div>
    )
}

export default Login
