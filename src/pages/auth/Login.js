import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import '../../styles/Login.css'
import useInputState from '../../modules/hooks/useInputState'
import '../../styles/Auth.css'
import { useLoginUserMutation } from '../../modules/services/userSlice'

function Login() {
    const [loginUser, isSubmitting] = useLoginUserMutation()
    const [validate, setValidate] = useState(false)

    const [username, changeUsername] = useInputState()
    const [password, changePassword] = useInputState()

    const [errors, setErrors] = useState({})

    const validateInput = useCallback(() => {
        let errors = {}

        if (username === '') errors.username = 'This field is required'
        else if (username.length < 3)
            errors.username = 'Username must be longer than 3 characters'

        if (password === '') errors.password = 'This field is required'
        else if (password.length < 3)
            errors.password = 'Password must be longer than 3 characters'

        setErrors(errors)
        return Object.keys(errors).length === 0
    }, [username, password])

    useEffect(() => {
        if (validate) validateInput()
    }, [username, password, validate, validateInput])

    const handleSubmit = e => {
        e.preventDefault()
        setValidate(true)
        if (validateInput()) {
            loginUser({ username, password })
        }
    }

    return (
        <div className="Auth">
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
                                disabled={isSubmitting}
                            >
                                Login
                            </Button>
                            {isSubmitting && (
                                <CircularProgress
                                    size={24}
                                    className="buttonProgress"
                                />
                            )}
                        </div>
                    </form>
                </div>
                <p>
                    or <Link to="/register">sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
