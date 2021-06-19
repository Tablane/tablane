import {Component} from 'react'
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import Login from './partials/Login';
import Register from './partials/Register';
import './assets/Auth.css'

class Auth extends Component {

    render() {
        return (
            <Router>
                <div className="Auth">
                    <Route exact path="/login" component={() => <Login changeToken={this.props.changeToken} />}/>
                    <Route exact path="/register" component={Register}/>
                    <Route path="/" component={() => <Redirect to="/login"/>}/>
                </div>
            </Router>
        );
    }
}

export default Auth