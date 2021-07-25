import {Component} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import SideBar from "./SideBar";
import TopMenu from "./TopMenu";
import Board from "./Board";
import Home from "./Home";
import {CircularProgress} from "@material-ui/core";
import {connect} from "react-redux";
import axios from "axios";
import {toast} from "react-hot-toast";

class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sideBarClosed: localStorage.getItem('sideBarClosed') === null
                ? false
                : JSON.parse(localStorage.getItem('sideBarClosed'))
        }
    }

    getData = async () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `http://localhost:3001/api/workspace${this.props.match.url}`
        }).then(res => {
            this.props.dispatch({type: 'setData', payload: ['workspaces', res.data]})
        }).catch(err => {
            this.props.history.push('/')
            toast(err.toString())
        })
    }

    componentDidMount() {
        this.getData()
    }

    toggleSideBar = () => {
        this.setState(st => ({
            sideBarClosed: !st.sideBarClosed
        }), () => {
            localStorage.setItem('sideBarClosed', JSON.stringify(this.state.sideBarClosed))
        })
    }

    render() {
        this.props.dispatch({type: 'workspaces', payload: null})
        const { url, path } = this.props.match;
        return (
            !this.props.workspaces
                ? <div className="loading"><CircularProgress/></div>
                : <Router>
                    <div className={`App ${this.state.sideBarClosed ? 'sidebar-closed' : ''}`}>
                        <SideBar
                            url={url}
                            getData={this.getData}
                            toggleSideBar={this.toggleSideBar}
                            sideBarClosed={this.state.sideBarClosed} />
                        <div style={{marginLeft: !this.state.sideBarClosed ? '280px' : ''}}>
                            <TopMenu
                                updateData={this.updateData}
                                toggleSideBar={this.toggleSideBar}
                                sideBarClosed={this.state.sideBarClosed} />
                            <div className="Board">
                                <Switch>
                                    <Route exact path={`${path}/:space/:board`} component={Board}/>
                                    <Route exact path={url} component={Home}/>
                                    <Route path="/" component={() => <Redirect to={url}/>}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </Router>
        );
    }
}

const mapStateToProps = (state) => ({
    workspaces: state.workspaces
})

export default connect(mapStateToProps)(Panel)