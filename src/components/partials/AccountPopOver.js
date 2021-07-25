import {Component} from 'react'
import {Popover} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import './assets/AccountPopOver.css'
import axios from "axios";
import {toast} from "react-hot-toast";
import {connect} from "react-redux";

class AccountPopOver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchor: null
        }
    }

    handleClick = (e) => {
        this.setState({ anchor: e.currentTarget})
    }

    handleClose = () => {
        this.setState({ anchor: null});
    }

    logout = () => {
        this.props.dispatch({type: 'changeLoggedIn'})
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:3001/api/user/logout",
        }).then((res) => {
            toast(res.data)
        }).catch(x => {
            toast(x)
        })
    }

    render() {
        return (
            <div>
                <Button style={{ borderRadius: 50, width: 30, height: 30 }} variant="contained" color="primary" onClick={this.handleClick}>
                    O
                </Button>
                <Popover
                    open={Boolean(this.state.anchor)}
                    anchorEl={this.state.anchor}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}>
                    <div className="popover">
                        <div>
                            <div className="workspaces">
                                <div>P</div>
                                <div>A</div>
                                <div><i className="fas fa-plus"> </i></div>
                            </div>
                            <div className="workspace-settings">
                                <div>
                                    <div className="circle">W</div>
                                    <p>Workspace</p>
                                </div>
                                <div className="buttons">
                                    <button>Settings</button>
                                    <button>Import/Export</button>
                                    <button>Teams</button>
                                    <button>Spaces</button>
                                    <button>Integrations</button>
                                    <button>Trash</button>
                                    <button>Security & Permissions</button>
                                </div>
                            </div>
                            <div className="user-settings">
                                <div>
                                    <div className="circle">FN</div>
                                    <p>Full Name</p>
                                </div>
                                <div className="buttons">
                                    <button>My Settings</button>
                                    <button>Notifications</button>
                                    <button>Layout size & style</button>
                                    <button>Apps</button>
                                    <button>Rewards</button>
                                    <button onClick={this.logout}>Log out</button>
                                </div>
                            </div>
                        </div>
                        <div className="download">
                            <div>
                                <p>Download Apps</p>
                            </div>
                            <div>
                                <i className="fab fa-apple"> </i>
                                <i className="fab fa-android"> </i>
                                <i className="fas fa-desktop"> </i>
                                <i className="fab fa-chrome"> </i>
                            </div>
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    workspaces: state.workspaces,
    isLoggedIn: state.isLoggedIn
})

export default connect(mapStateToProps)(AccountPopOver)