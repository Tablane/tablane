import {Component} from 'react'
import './App.css';
import Auth from './components/Auth'
import axios from "axios";
import {toast} from "react-hot-toast";
import {CircularProgress} from "@material-ui/core";
import {connect} from "react-redux";
import Panel from "./components/Panel";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import WorkspaceSelector from "./components/partials/WorkspaceSelector";
import SharedBoard from "./components/partials/SharedBoard";
import Settings from "./components/Settings";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/user`
        }).then(res => {
            this.props.dispatch({type: 'changeLoggedIn', payload: res.data})
            this.setState({
                loading: false,
            })
        }).catch(err => {
            toast(err.toString())
            this.setState({
                loading: false,
            })
        })
    }

    render() {
        if (this.state.loading) return <div className="loading"><CircularProgress/></div>
        return (
            <Router>
                <Switch>
                    <Route path="/share/:boardId" component={SharedBoard}/>
                    {!this.props.isLoggedIn && <Route path="/" component={Auth}/>}
                    <Route exact path={['/login', '/register']} render={({history}) => history.push('/')}/>
                    <Route path="/settings/:workspace" component={Settings}/>
                    <Route path="/:workspace" component={Panel}/>
                    <Route path="/" render={({history}) => (
                        <WorkspaceSelector history={history} workspaces={this.props.isLoggedIn.workspaces}/>
                    )}/>
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.isLoggedIn
})

export default connect(mapStateToProps)(App);
