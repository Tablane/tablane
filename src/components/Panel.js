import {useCallback, useEffect, useMemo, useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import SideBar from "./SideBar";
import TopMenu from "./TopMenu";
import Board from "./Board";
import Home from "./Home";
import {CircularProgress} from "@material-ui/core";
import axios from "axios";
import {toast} from "react-hot-toast";
import useLocalStorageState from "../hooks/useLocalStorageState";
import WorkspaceContext from "../context/WorkspaceContext";

function Panel(props) {
    const [sidebarOpen, setSidebarOpen] = useLocalStorageState('sidebarOpen', true)
    const [workspace, setWorkspace] = useState(null)

    const getWorkspaceData = useCallback(async() => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/${props.match.params.workspace}`
        }).then(res => {
            setWorkspace(res.data)
        }).catch(err => {
            props.history.push('/')
            toast(err.toString())
        })
    }, [props.match.params.workspace, props.history])

    useEffect(() => {
        getWorkspaceData()
    }, [getWorkspaceData])

    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const providerValue = useMemo(() => ({workspace, getData: getWorkspaceData}), [workspace, getWorkspaceData])

    const {url, path} = props.match;
    return (
        !workspace
            ? <div className="loading"><CircularProgress/></div>
            : <WorkspaceContext.Provider value={providerValue}>
                <div className={`App ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
                    <SideBar
                        history={props.history}
                        url={url}
                        getData={getWorkspaceData}
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
            </WorkspaceContext.Provider>
    );
}

export default Panel