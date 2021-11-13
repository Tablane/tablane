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

    registerUser = async () => {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                data: {
                    username: this.state.username,
                    password: this.state.password,
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/register`,
            }).then((res) => {
                if (res.data === "Successfully registered") resolve(res.data)
                else reject(res.data)
            }).catch(err => console.log(err))
        })
    }

    handleSubmit = () => {
        this.setState({ loading: true })
        this.registerUser()
            .then(x => {
                toast(x)
                this.props.changeLoggedIn(true)
            })
            .catch(x => {
                toast(x)
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <div className="form">
                <div>
                    <form action="">
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
                                disabled={this.state.loading}>Register</Button>
                            {this.state.loading && <CircularProgress size={24} className="buttonProgress" />}
                        </div>
                    </form>
                </div>
                <p>or <Link to="/login">login</Link></p>
            </div>
        );
    }
}

export default Login