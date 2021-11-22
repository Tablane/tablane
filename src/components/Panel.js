import {useCallback, useEffect} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import SideBar from "./SideBar";
import TopMenu from "./TopMenu";
import Board from "./Board";
import Home from "./Home";
import {CircularProgress} from "@material-ui/core";
import {connect} from "react-redux";
import axios from "axios";
import {toast} from "react-hot-toast";
import useLocalStorageState from "../hooks/useLocalStorageState";

function Panel(props) {
    const [sidebarOpen, setSidebarOpen] = useLocalStorageState('sidebarOpen', true)

    const getData = useCallback(async() => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace${props.match.url}`
        }).then(res => {
            props.dispatch({type: 'setData', payload: ['workspaces', res.data]})
        }).catch(err => {
            props.history.push('/')
            toast(err.toString())
        })
    }, [props])

    useEffect(() => {
        getData()
    }, [getData])

    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const {url, path} = props.match;
    return (
        !props.workspaces
            ? <div className="loading"><CircularProgress/></div>
            : <div className={`App ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
                <SideBar
                    history={props.history}
                    url={url}
                    getData={getData}
                    toggleSideBar={toggleSideBar}
                    sideBarClosed={!sidebarOpen}/>
                <div style={{marginLeft: sidebarOpen ? '280px' : ''}}>
                    <TopMenu
                        toggleSideBar={toggleSideBar}
                        sideBarClosed={!sidebarOpen}/>
                    <div className="Board">
                        <Switch>
                            <Route exact path={`${path}/:space/:board`} component={Board}/>
                            <Route exact path={url} component={Home}/>
                            <Route path="/:workspace" component={() => <Redirect to={url}/>}/>
                        </Switch>
                    </div>
                </div>
            </div>
    );

}

const mapStateToProps = (state) => ({
    workspaces: state.workspaces
})

export default connect(mapStateToProps)(Panel)