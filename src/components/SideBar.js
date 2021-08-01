import React, {Component} from 'react'
import './assets/SideBar.css'
import {Link, NavLink} from 'react-router-dom'
import AccountPopOver from "./partials/AccountPopover";
import {connect} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {toast} from "react-hot-toast";
import AnimateHeight from "react-animate-height";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newBoardDialogOpen: false,
            newSpaceDialogOpen: false,
            spacesOpen: JSON.parse(localStorage.getItem('spacesOpen')) !== null ? JSON.parse(localStorage.getItem('spacesOpen')) : true,
            name: '',
            spaceClosed: JSON.parse(localStorage.getItem('spaceClosed')) || [],

            // handle delete dialogs
            deleteBoardDialogOpen: false,
            deleteSpaceDialogOpen: false,
            deleteBoard: '',
            deleteSpace: '',
        }
    }

    handleSpaceDeleteClick = (spaceId = '') => {
        this.setState(st => ({
            deleteSpaceDialogOpen: !st.deleteSpaceDialogOpen,
            deleteSpace: spaceId
        }))
    }

    handleSpaceDelete = async () => {
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/space/${this.props.workspaces._id}/${this.state.deleteSpace}`
        }).then(res => {
            this.props.getData()
            this.setState({deleteSpaceDialogOpen: false})
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleBoardDeleteClick = (spaceId = '', boardId = '') => {
        this.setState(st => ({
            deleteBoardDialogOpen: !st.deleteBoardDialogOpen,
            deleteBoard: boardId,
            deleteSpace: spaceId,
        }))
    }

    handleBoardDelete = async () => {
        const {workspaces} = this.props
        const {deleteSpace, deleteBoard} = this.state
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/board/${workspaces._id}/${deleteSpace}/${deleteBoard}`
        }).then(res => {
            this.props.getData()
            this.setState({deleteBoardDialogOpen: false})
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

        this.setState({spaceClosed: newSpaceClosed}, this.syncSpaceClosed)
    }

    syncSpaceClosed = () => {
        localStorage.setItem('spaceClosed', JSON.stringify(this.state.spaceClosed))
    }

    toggleSpaces = () => {
        localStorage.setItem('spacesOpen', JSON.stringify(!this.state.spacesOpen))
        this.setState(st => ({spacesOpen: !st.spacesOpen}))
    }

    handleDragStart = () => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'pointer'
    }

    handleDragEnd = async (result) => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'auto'
        if (result.destination === null ||
            (result.destination.index === result.source.index
                && result.destination.droppableId === result.source.droppableId)) return
        if (result.type === "board") {
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `http://localhost:3001/api/board/${this.props.workspaces._id}`
            }).then(res => {
                this.props.getData()
            }).catch(err => {
                toast(err.toString())
            })
        } else if (result.type === "space") {
            await axios({
                method: 'PATCH',
                withCredentials: true,
                data: {
                    result
                },
                url: `http://localhost:3001/api/space/${this.props.workspaces._id}`
            }).then(res => {
                this.props.getData()
            }).catch(err => {
                toast(err.toString())
            })
        }
    }

    renderSpaces = () => {
        return this.props.workspaces.spaces.map((space, i) => (
                <Draggable draggableId={space._id} key={space._id} index={i}>
                    {(provided) => (
                        <div className="space" {...provided.draggableProps} ref={provided.innerRef}>
                            <div className="space-title" {...provided.dragHandleProps}>
                                <div>
                                    <i className={`fas fa-caret-right ${this.state.spaceClosed.includes(space._id) ? '' : 'open'}`}> </i>
                                </div>
                                <div onClick={() => this.toggleClosed(space._id)}>
                                    <div className="space-icon">{space.name.charAt(0).toUpperCase()}</div>
                                    <p>{space.name}</p>
                                </div>
                                <div>
                                    <i onClick={() => this.setState({newBoardDialogOpen: true, currentSpace: space._id})}
                                       className="fas fa-plus"> </i>
                                    <i onClick={() => this.handleSpaceDeleteClick(space._id)} className="fas fa-trash-alt"> </i>
                                </div>
                            </div>

                            <AnimateHeight
                                className="space-boards"
                                duration={200}
                                height={this.state.spaceClosed.includes(space._id) ? 0 : 'auto'}>
                                <Droppable droppableId={space._id} type="board">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {space.boards.map((board, i) => {
                                                return (
                                                    <Draggable key={board._id} draggableId={board._id} index={i}>
                                                        {(provided) => (
                                                            <NavLink
                                                                {...provided.draggableProps}
                                                                ref={provided.innerRef}
                                                                {...provided.dragHandleProps}
                                                                to={`/${this.props.url.replaceAll('/', '')}/${space.name.replaceAll(' ', '-')}/${board.name.replaceAll(' ', '-')}`}
                                                                activeClassName="active-board">
                                                                <div> </div>
                                                                <p>{board.name}</p>
                                                                <i onClick={(e) => {
                                                                    e.preventDefault()
                                                                    this.handleBoardDeleteClick(space._id, board._id)
                                                                }} className="fas fa-trash-alt"> </i>
                                                            </NavLink>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </AnimateHeight>
                        </div>
                    )}
                </Draggable>
            )
        )
    }

    render() {
        return (
            <div className={`SideBar ${this.props.sideBarClosed ? 'closed' : ''}`}>
                <div className="header">
                    <div className="logo">
                        <Link to={this.props.url}>
                            <p>Task Board</p>
                        </Link>
                    </div>
                    <div className="icons">
                        <i className="fas fa-cog"> </i>
                        <i className="fas fa-angle-double-left" onClick={this.props.toggleSideBar}> </i>
                    </div>
                </div>
                <div className="boards">
                    <div onClick={this.toggleSpaces} className="section-name">
                        <label>Spaces</label>
                        <i style={{transition: 'transform 0.2s', transform: this.state.spacesOpen ? 'rotate(360deg)' : 'rotate(270deg)'}} className="fas fa-angle-down"> </i>
                    </div>

                    <AnimateHeight
                        className="spaces"
                        duration={200}
                        height={this.state.spacesOpen ? 'auto' : 0}
                    >
                        <div className="new-btn">
                            <button onClick={() => this.setState({newSpaceDialogOpen: true})}><i
                                className="fas fa-plus"> </i>New Space
                            </button>
                        </div>
                        <div className="space">
                            <div className="space-title">
                                <div></div>
                                <div>
                                    <div className="space-icon"><i className="fas fa-th-large"> </i></div>
                                    <p>Everything</p>
                                </div>
                            </div>
                        </div>

                        <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
                            <Droppable droppableId="spaces" type="space">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {this.renderSpaces()}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </AnimateHeight>
                </div>

                <div className="boards">
                    <div className="section-name">
                        <label>Something else</label>
                        <i className="fas fa-angle-down"> </i>
                    </div>
                </div>

                <div className="account">
                    <AccountPopOver history={this.props.history} />
                </div>

                {/* create board dialog*/}
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

                {/* create space dialog*/}
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

                {/* delete board dialog*/}
                <Dialog
                    open={this.state.deleteBoardDialogOpen}
                    onClose={this.handleBoardDeleteClick}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Remove Board?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            All tasks within this Board will be deleted.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleBoardDeleteClick} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleBoardDelete} color="primary" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/*delete space dialog*/}
                <Dialog
                    open={this.state.deleteSpaceDialogOpen}
                    onClose={this.handleSpaceDeleteClick}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Remove Space?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            All boards and tasks within this Space will be deleted.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSpaceDeleteClick} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSpaceDelete} color="primary" variant="contained">
                            Delete
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