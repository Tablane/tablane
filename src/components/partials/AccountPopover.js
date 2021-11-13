import {Component} from 'react'
import {Popover} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import './assets/AccountPopover.css'
import axios from "axios";
import {toast} from "react-hot-toast";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

class AccountPopover extends Component {
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
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/user/logout`,
        }).then((res) => {
            toast(res.data)
        }).catch(x => {
            toast(x)
        })
    }

    changeWorkspace = (id) => {
        this.props.history.push(`/${id}`)
        this.handleClose()
    }

    render() {
        const workspaceId = this.props.workspaces.id
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
                                {this.props.isLoggedIn && this.props.isLoggedIn.workspaces.map(x => {
                                    return (
                                        <div onClick={() => this.changeWorkspace(x.id)} key={x._id}>
                                            {x.name.toUpperCase().charAt(0)}
                                        </div>
                                    )
                                })}
                                <div><i className="fas fa-plus"> </i></div>
                            </div>
                            <div className="workspace-settings">
                                <div>
                                    <div className="circle">W</div>
                                    <p>Workspace</p>
                                </div>
                                <div className="buttons">
                                    <Link to={`/settings/${workspaceId}/general`}>Settings</Link>
                                    <Link to={`/settings/${workspaceId}/import`}>Import/Export</Link>
                                    <Link to={`/settings/${workspaceId}/users`}>People</Link>
                                    <Link to={`/settings/${workspaceId}/apps`}>Apps</Link>
                                    <Link to={`/settings/${workspaceId}/integrations`}>Integrations</Link>
                                    <Link to={`/settings/${workspaceId}/trash`}>Trash</Link>
                                    <Link to={`/settings/${workspaceId}/permissions`}>Security & Permissions</Link>
                                </div>
                            </div>
                            <div className="user-settings">
                                <div>
                                    <div className="circle">FN</div>
                                    <p>Full Name</p>
                                </div>
                                <div className="buttons">
                                    <Link to={`/settings/user/profile`}>My Settings</Link>
                                    <Link to={`/settings/user/notifications`}>Notifications</Link>
                                    <Link to={`/settings/user/apps`}>Apps</Link>
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

export default connect(mapStateToProps)(AccountPopover)