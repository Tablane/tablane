import {Component} from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Login from './partials/Login';
import Register from './partials/Register';
import './assets/Auth.css'

class Auth extends Component {

    render() {
        return (
            <Router>
                <div className="Auth">
                    <Switch>
                        <Route exact path="/login" component={() => <Login changeLoggedIn={this.props.changeLoggedIn} />}/>
                        <Route exact path="/register" component={Register}/>
                        <Route path="/" component={() => <Redirect to="/login"/>}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default Auth