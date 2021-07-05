import React, {Component} from 'react'
import './assets/SideBar.css'
import {Link, NavLink} from 'react-router-dom'
import AccountPopOver from "./partials/AccountPopOver";
import {connect} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {dialogOpen: false}
    }

    renderSpaces = () => {
        return this.props.workspaces.spaces.map(space => {
            return (
                <div className="space" key={space.name}>
                    <div className="space-title">
                        <div><i className="fas fa-caret-right"> </i></div>
                        <div>
                            <div className="space-icon">{space.name.charAt(0)}</div>
                            <p>{space.name}</p>
                        </div>
                        <div>
                            <i className="fas fa-plus"> </i>
                            <i className="fas fa-trash-alt"> </i>
                        </div>
                    </div>
                    <div className="space-boards">
                        {space.boards.map(board => {
                            return (
                                <NavLink
                                    to={`/${this.props.url.replaceAll('/', '')}/${space.name.replace(' ', '-')}/${board.name.replace(' ', '-')}`}
                                    activeClassName="active-board"
                                    key={board.name}>
                                    <div> </div>
                                    <p>{board.name}</p>
                                    <i className="fas fa-trash-alt"> </i>
                                </NavLink>
                            )
                        })}
                    </div>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="SideBar">
                <div className="header">
                    <div className="logo">
                        <Link to="/">
                            <p>Task Board</p>
                        </Link>
                    </div>
                    <div className="icons">
                        <i className="fas fa-cog"> </i>
                        <i className="fas fa-angle-double-left"> </i>
                    </div>
                </div>
                <div className="boards">
                    <div className="section-name">
                        <label>Spaces</label>
                        <i className="fas fa-angle-down"> </i>
                    </div>
                    <div className="new-btn">
                        <button><i className="fas fa-plus"> </i>New Space</button>
                    </div>

                    <div className="spaces">
                        <div className="space">
                            <div className="space-title">
                                <div> </div>
                                <div>
                                    <div className="space-icon"><i className="fas fa-th-large"> </i></div>
                                    <p>Everything</p>
                                </div>
                            </div>
                        </div>

                        {this.renderSpaces()}
                    </div>
                </div>

                <div className="account">
                    <AccountPopOver />
                </div>

                <Dialog
                    open={this.state.dialogOpen}
                    onClose={() => this.setState({dialogOpen: false})}
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}>
                    <DialogTitle id="form-dialog-title">Add new task group</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            onChange={this.handleChange}
                            label="task group Name"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({dialogOpen: false})} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleNewTaskgroup} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    workspaces: state.workspaces,
    isLoggedIn: state.isLoggedIn
})

export default connect(mapStateToProps)(SideBar)