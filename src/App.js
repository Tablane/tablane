import {useEffect} from 'react'
import './App.css';
import Auth from './pages/Auth'
import {CircularProgress} from "@material-ui/core";
import Panel from "./pages/Panel";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import WorkspaceSelector from "./pages/WorkspaceSelector";
import SharedBoard from "./pages/SharedBoard";
import Settings from "./pages/Settings";
import ContextProvider from "./ContextProvider";
import SyncError from "./pages/SyncError";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import actionCreators from "./modules/state/actionCreators";

function App() {
    const account = useSelector(state => state.account)
    const dispatch = useDispatch()
    const {getCurrentUser} = bindActionCreators(actionCreators, dispatch)

    useEffect(() => {
        getCurrentUser()
    }, [])

    if (account.loading) return <div className="loading"><CircularProgress/></div>
    return (
        <ContextProvider>
            <Router>
                <Switch>
                    <Route path="/share/:boardId" component={SharedBoard}/>
                    {!account.user && <Route path="/" component={Auth}/>}
                    <Route exact path={['/login', '/register']} render={({ history }) => history.push('/')}/>
                    <Route path="/settings/:workspace" component={Settings}/>
                    <Route path="/:workspace" component={Panel}/>
                    <Route path="/" render={({ history }) => (
                        <WorkspaceSelector history={history} workspaces={account.user.workspaces}/>
                    )}/>
                </Switch>
            </Router>
            <SyncError/>
        </ContextProvider>
    );
}

export default App
