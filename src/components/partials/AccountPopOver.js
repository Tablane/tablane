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
                        <div className="">
                            <div className="workspaces">
                                <div>P</div>
                                <div>A</div>
                                <div>+</div>
                            </div>
                            <div className="workspace-settings">
                                <div>
                                    <div className="circle">P</div>
                                    <p>producers</p>
                                </div>
                                <div className="buttons">
                                    <button>settings</button>
                                    <button>placeholder</button>
                                    <button>placeholder</button>
                                    <button>placeholder</button>
                                    <button>placeholder</button>
                                </div>
                            </div>
                            <div className="user-settings">
                                <div>
                                    <div className="circle">AP</div>
                                    <p>app producer</p>
                                </div>
                                <div className="buttons">
                                    <button>placeholder</button>
                                    <button>placeholder</button>
                                    <button>placeholder</button>
                                    <button>placeholder</button>
                                    <button onClick={() => {
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
                                    }}>logout</button>
                                </div>
                            </div>
                        </div>
                        <div className="download">
                            <p>Download APPS</p>
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