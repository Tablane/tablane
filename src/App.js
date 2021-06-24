import {Component} from 'react'
import './App.css';
import Board from './components/Board'
import SideBar from './components/SideBar'
import TopMenu from './components/TopMenu'
import Home from './components/Home'
import Auth from './components/Auth'
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import axios from "axios";
import {toast} from "react-hot-toast";
import {CircularProgress} from "@material-ui/core";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loggedIn: false,
            data: null
        }
    }

    changeLoggedIn = async (loggedIn) => {
        console.log('get data done in change logged in function')
        this.setState({
            loggedIn
        })
    }

    checkUser = async () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: 'http://localhost:3001/api/user/user'
        }).then(res => {
            this.setState({
                loading: false,
                loggedIn: res.data
            })
        }).catch(err => {
            toast(err.toString())
            this.setState({
                loading: false,
                loggedIn: false
            })
        })
    }

    componentDidMount() {
        this.checkUser()
    }

    getData = () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: 'http://localhost:3001/api/workspace/9719'
        }).then(res => {
            if (res.data !== 'no perms') {
                this.setState({
                    data: res.data
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.data) {
            this.getData()
        }
    }

    render() {
        return (
            this.state.loading ? <div className="loading"><CircularProgress/></div> :
                !this.state.loggedIn || false ? <Auth changeLoggedIn={this.changeLoggedIn}/> :
                    !this.state.data ? <div className="loading"><CircularProgress/></div> :
                        <Router>
                            <div className="App">
                                <SideBar data={this.state.data} changeLoggedIn={this.changeLoggedIn}/>
                                <TopMenu/>
                                <Switch>
                                    <Route exact path="/:workspace/:space/:board"
                                           component={(match) =>
                                               <Board tasks={this.state.data} getData={this.getData} match={match.match}/>}/>
                                    <Route exact path="/" component={Home}/>
                                    <Route path="/" component={() => <Redirect to="/"/>}/>
                                </Switch>
                            </div>
                        </Router>
        );
    }
}

export default App;
