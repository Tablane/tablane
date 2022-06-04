import { useEffect } from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import SideBar from "./panel/SideBar";
import TopMenu from "./panel/TopMenu";
import Board from "./panel/Board";
import Home from "./panel/Home";
import {CircularProgress} from "@material-ui/core";
import useLocalStorageState from "../modules/hooks/useLocalStorageState";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkspace } from "../modules/state/reducers/workspaceReducer";

function Panel(props) {
    const { workspace } = useSelector(state => state.workspace)
    const [sidebarOpen, setSidebarOpen] = useLocalStorageState('sidebarOpen', true)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchWorkspace(props.match.params.workspace))
    }, [])

    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const {url, path} = props.match;
    return (
        !workspace
            ? <div className="loading"><CircularProgress/></div>
            : <div className={`App ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
                <SideBar
                    history={props.history}
                    url={url}
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
    );
}

export default Panel