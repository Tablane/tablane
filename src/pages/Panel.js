import {useCallback, useEffect, useMemo, useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import SideBar from "./panel/SideBar";
import TopMenu from "./panel/TopMenu";
import Board from "./panel/Board";
import Home from "./panel/Home";
import {CircularProgress} from "@material-ui/core";
import axios from "axios";
import {toast} from "react-hot-toast";
import useLocalStorageState from "../modules/hooks/useLocalStorageState";
import WorkspaceContext from "../modules/context/WorkspaceContext";
import { useDispatch } from "react-redux";
import { fetchWorkspace } from "../modules/state/reducers/workspaceReducer";

function Panel(props) {
    const [sidebarOpen, setSidebarOpen] = useLocalStorageState('sidebarOpen', true)
    const [workspace, setWorkspace] = useState(null)
    const dispatch = useDispatch()

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
        dispatch(fetchWorkspace(props.match.params.workspace))
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
                    <div className={`PanelContent ${sidebarOpen ? 'hidden' : ''}`}>
                        <TopMenu
                            toggleSideBar={toggleSideBar}
                            sideBarClosed={!sidebarOpen}/>
                        <div className="Board">
                            <Switch>
                                <Route exact path={`${path}/:space/:board/:taskId?`} component={Board}/>
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