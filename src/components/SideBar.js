import React, {Component} from 'react'
import './assets/SideBar.css'
import {Link} from 'react-router-dom'
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
                <div className="board" key={space.name}>
                    <div>
                        <i className="fas fa-cloud"> </i>
                        <p>{space.name}</p>
                    </div>
                    {space.boards.map(board => {
                        return (
                            <Link to={`/${this.props.url.replaceAll('/', '')}/${space.name.replace(' ', '-')}/${board.name.replace(' ', '-')}`}
                                  key={board.name}>
                                <span key={board.name}>{board.name}</span>
                            </Link>
                        )
                    })}
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
                    <label>Spaces</label>
                    <div className="new-btn">
                        <button><i className="fas fa-plus"> </i>New Space</button>
                    </div>

                    <div className="board">
                        <div>
                            <i className="fas fa-cloud"> </i>
                            <p>Everything</p>
                        </div>
                    </div>

                    {this.renderSpaces()}

                </div>
                <div className="account">
                    <AccountPopOver />
                </div>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={() => this.setState({dialogOpen: false})}
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}>
                    <DialogTitle id="form-dialog-title">Add new taskgroup</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            onChange={this.handleChange}
                            label="Taskgroup Name"
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