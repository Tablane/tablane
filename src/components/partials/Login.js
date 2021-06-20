import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {Component} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {CircularProgress} from "@material-ui/core";
import './assets/Login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            username: '',
            password: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    loginUser = async () => {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                data: {
                    username: this.state.username,
                    password: this.state.password,
                },
                withCredentials: true,
                url: "http://localhost:3001/login",
            }).then((res) => {
                if (res.data === "logged in") resolve(res.data)
                else reject(res.data)
            }).catch(err => console.log(err))
        })
    }

    handleSubmit = () => {
        this.setState({ loading: true })
        this.loginUser()
            .then(x => {
                this.props.changeLoggedIn(true)
                toast('Successfully logged in.')
            })
            .catch(x => {
                toast('Username or password is wrong.')
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <div className="form">
                <div>
                    <div className="inputs">
                        <TextField
                            id="username"
                            name="username"
                            label="Username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            required/>
                        <TextField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            required/>
                    </div>
                    <div className="progressWrapper">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            disabled={this.state.loading}>Login</Button>
                        {this.state.loading && <CircularProgress size={24} className="buttonProgress" />}
                    </div>
                </div>
                <p>or <Link to="/register">sign up</Link></p>
            </div>
        );
    }
}

export default Login