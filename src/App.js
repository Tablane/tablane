import {useEffect, useMemo, useState} from 'react'
import './App.css';
import Auth from './components/Auth'
import axios from "axios";
import {toast} from "react-hot-toast";
import {CircularProgress} from "@material-ui/core";
import Panel from "./components/Panel";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import WorkspaceSelector from "./components/partials/WorkspaceSelector";
import SharedBoard from "./components/partials/SharedBoard";
import Settings from "./components/Settings";
import UserContext from "./context/UserContext";
import ContextProvider from "./ContextProvider";

function App(props) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect( () => {
        getUserData()
    }, [])

    const getUserData = async () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/user`
        }).then(res => {
            setUser(res.data.user)
            setLoading(false)
        }).catch(err => {
            toast(err.toString())
            setLoading(false)
        })
    }

    const userProviderValue = useMemo(() => ({user, setUser}), [user, setUser])

    if (loading) return <div className="loading"><CircularProgress/></div>
    return (
        <UserContext.Provider value={userProviderValue}>
            <ContextProvider>
                <Router>
                    <Switch>
                        <Route path="/share/:boardId" component={SharedBoard}/>
                        {!user && <Route path="/" component={Auth}/>}
                        <Route exact path={['/login', '/register']} render={({history}) => history.push('/')}/>
                        <Route path="/settings/:workspace" component={Settings}/>
                        <Route path="/:workspace" component={Panel}/>
                        <Route path="/" render={({history}) => (
                            <WorkspaceSelector history={history} workspaces={user.workspaces}/>
                        )}/>
                    </Switch>
                </Router>
            </ContextProvider>
        </UserContext.Provider>
    );
}

export default App
