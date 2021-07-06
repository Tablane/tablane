import React, {Component} from 'react'
import './assets/SideBar.css'
import {Link, NavLink} from 'react-router-dom'
import AccountPopOver from "./partials/AccountPopOver";
import {connect} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {toast} from "react-hot-toast";

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newBoardDialogOpen: false,
            newSpaceDialogOpen: false,
            spacesOpen: true,
            name: '',
            spaceClosed: []
        }
    }

    handleSpaceDelete = async (spaceId) => {
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/space/${this.props.workspaces._id}/${spaceId}`
        }).then(res => {
            this.props.getData()
            this.setState({newSpaceDialogOpen: false})
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleBoardDelete = async (spaceId, boardId) => {
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/board/${this.props.workspaces._id}/${spaceId}/${boardId}`
        }).then(res => {
            this.props.getData()
            this.setState({newBoardDialogOpen: false})
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleNewSpace = async () => {
        await axios({
            method: 'POST',
            withCredentials: true,
            data: {
                name: this.state.name
            },
            url: `http://localhost:3001/api/space/${this.props.workspaces._id}`
        }).then(res => {
            this.props.getData()
            this.setState({newSpaceDialogOpen: false})
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleNewBoard = async () => {
        await axios({
            method: 'POST',
            withCredentials: true,
            data: {
                name: this.state.name
            },
            url: `http://localhost:3001/api/board/${this.props.workspaces._id}/${this.state.currentSpace}`
        }).then(res => {
            this.props.getData()
            this.setState({newBoardDialogOpen: false})
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggleClosed = (x) => {
        const newSpaceClosed = this.state.spaceClosed
        const xIndex = newSpaceClosed.indexOf(x)

        if (xIndex !== -1) newSpaceClosed.splice(xIndex, 1)
        else newSpaceClosed.push(x)

        this.setState({spaceClosed: newSpaceClosed})
    }

    renderSpaces = () => {
        return this.props.workspaces.spaces.map(space => {
            return (
                <div className="space" key={space.name}>
                    <div className="space-title">
                        <div>
                            <i className={`fas fa-caret-right ${this.state.spaceClosed.includes(space._id) ? '' : 'open'}`}> </i>
                        </div>
                        <div onClick={() => this.toggleClosed(space._id)}>
                            <div className="space-icon">{space.name.charAt(0).toUpperCase()}</div>
                            <p>{space.name}</p>
                        </div>
                        <div>
                            <i onClick={() => this.setState({newBoardDialogOpen: true, currentSpace: space._id})} className="fas fa-plus"> </i>
                            <i onClick={() => this.handleSpaceDelete(space._id)} className="fas fa-trash-alt"> </i>
                        </div>
                    </div>
                    <div className={`space-boards ${this.state.spaceClosed.includes(space._id) ? 'closed' : ''}`}>
                        {space.boards.map(board => {
                            return (
                                <NavLink
                                    to={`/${this.props.url.replaceAll('/', '')}/${space.name.replace(' ', '-')}/${board.name.replace(' ', '-')}`}
                                    activeClassName="active-board"
                                    key={board.name}>
                                    <div> </div>
                                    <p>{board.name}</p>
                                    <i onClick={(e) => {
                                        e.preventDefault()
                                        this.handleBoardDelete(space._id, board._id)
                                    }} className="fas fa-trash-alt"> </i>
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
                    <div onClick={() => this.setState(st => ({spacesOpen: !st.spacesOpen}))} className="section-name">
                        <label>Spaces</label>
                        <i style={{transition: 'transform 0.2s', transform: this.state.spacesOpen ? 'rotate(360deg)' : 'rotate(270deg)'}} className="fas fa-angle-down"> </i>
                    </div>

                    <div className={`spaces ${this.state.spacesOpen ? '' : 'space-closed'}`}>
                        <div className="new-btn">
                            <button onClick={() => this.setState({newSpaceDialogOpen: true})}><i className="fas fa-plus"> </i>New Space</button>
                        </div>
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

                <div className="boards">
                    <div className="section-name">
                        <label>Something else</label>
                        <i className="fas fa-angle-down"> </i>
                    </div>

                </div>

                <div className="account">
                    <AccountPopOver />
                </div>

                <Dialog
                    open={this.state.newBoardDialogOpen}
                    onClose={() => this.setState({dialogOpen: false})}
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}>
                    <DialogTitle id="form-dialog-title">Add new Board</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            onChange={this.handleChange}
                            label="board name"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({newBoardDialogOpen: false})} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleNewBoard} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.newSpaceDialogOpen}
                    onClose={() => this.setState({dialogOpen: false})}
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}>
                    <DialogTitle id="form-dialog-title">Add new Space</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            onChange={this.handleChange}
                            label="Space name"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({newSpaceDialogOpen: false})} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleNewSpace} color="primary">
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