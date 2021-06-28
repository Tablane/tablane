import {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from './partials/Login';
import Register from './partials/Register';
import './assets/Auth.css'
import {connect} from "react-redux";

class Auth extends Component {

    redirectToLogin = (routeProps) => {
        this.props.dispatch({ type: 'setData', payload: ['redirectUrl', routeProps.location.pathname] })
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

const mapStateToProps = (state) => ({
    redirectUrl: state.redirectUrl
})

export default connect(mapStateToProps)(Auth)