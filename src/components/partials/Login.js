import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {Component} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if (this.state.username && this.state.password) {
            return await axios.post('http://localhost:3001/login', {
                username: this.state.username,
                password: this.state.password
            })
                .then(data => data.data)
        }
    }

    handleSubmit = () => {
        this.loginUser()
            .then(x => {
                this.props.changeToken(x.token)
                toast('Successfully logged in.');
            })
            .catch(x => toast('Username or password is wrong.'))
    }

    render() {
        return (
            <div className="form">
                <div>
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}>Login</Button>
                </div>
                <p>or <Link to="/register">sign up</Link></p>
            </div>
        );
    }
}

export default Login