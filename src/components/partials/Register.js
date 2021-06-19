import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {Component} from "react";

class Register extends Component {
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

    render() {
        return (
            <div className="form">
                <div>
                    <TextField
                        id="username"
                        name="username"
                        label="Username"
                        onChange={this.handleChange}
                        required/>
                    <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        onChange={this.handleChange}
                        required/>
                    <Button variant="contained" color="primary">Register</Button>
                </div>
                <p>or <Link to="/login">login</Link></p>
            </div>
        );
    }
}

export default Register