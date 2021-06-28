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

    componentDidMount() {
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

    render() {
        this.props.dispatch({type: 'workspaces', payload: null})
        const { url, path } = this.props.match;
        return (
            !this.props.workspaces
                ? <div className="loading"><CircularProgress/></div>
                : <Router>
                    <div className="App">
                        <SideBar url={url} />
                        <TopMenu updateData={this.updateData}/>
                        <div className="Board">
                            <Switch>
                                <Route exact path={`${path}/:space/:board`} component={Board}/>
                                <Route exact path={url} component={Home}/>
                                <Route path="/" component={() => <Redirect to={url}/>}/>
                            </Switch>
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