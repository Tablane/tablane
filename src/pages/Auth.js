import {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from './auth/Login';
import Register from './auth/Register';
import '../components/assets/Auth.css'

class Auth extends Component {

    redirectToLogin = (routeProps) => {
        routeProps.history.push('/login')
    }

    render() {
        return (
            <Router>
                <div className="Auth">
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route path="/" render={(routeProps) => this.redirectToLogin(routeProps) }/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default Auth