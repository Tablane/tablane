import React, {useContext, useState} from 'react'
import '../../components/assets/SideBar.css'
import {Link, NavLink} from 'react-router-dom'
import AccountPopOver from "./sideBar/AccountPopover";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {toast} from "react-hot-toast";
import AnimateHeight from "react-animate-height";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import BoardPopover from "./sideBar/BoardPopover";
import SpacePopover from "./sideBar/SpacePopover";
import WorkspaceContext from "../../modules/context/WorkspaceContext";
import useLocalStorageState from "../../modules/hooks/useLocalStorageState";
import useInputState from "../../modules/hooks/useInputState";
import useToggleState from "../../modules/hooks/useToggleState";

function SideBar(props) {
    // new space dialog
    const [newSpaceDialogOpen, changeNewSpaceDialogOpen, resetNewSpaceDialogOpen] = useToggleState(false)
    const [newSpaceName, changeNewSpaceName] = useInputState('')

    // localstorage space opened state
    const [spaceTabOpen, setSpaceTabOpen] = useLocalStorageState('spaceTabOpen', true)
    const [spacesClosed, setSpacesClosed] = useLocalStorageState('spacesClosed', [])

    // popover dialogs
    const [boardPopoverAnchor, setBoardPopoverAnchor] = useState(null)
    const [spacePopoverAnchor, setSpacePopoverAnchor] = useState(null)
    const [popoverSpace, setPopoverSpace] = useState('')
    const [popoverBoard, setPopoverBoard] = useState('')

    // new board
    const [newBoardSpace, , resetNewBoardSpace, setNewBoardSpace] = useInputState('')
    const [newBoardName, changeNewBoardName, resetNewBoardName] = useInputState('')

    // editing
    const [editingBoard, setEditingBoard] = useState('')
    const [editingSpace, setEditingSpace] = useState('')
    const [editingBoardName, changeEditingBoardName] = useInputState('')
    const [editingSpaceName, changeEditingSpaceName] = useInputState('')

    // workspace
    const {workspace, getData} = useContext(WorkspaceContext)

    const boardClick = (space, board, e) => {
        e.preventDefault()
        setBoardPopoverAnchor(e.currentTarget)
        setPopoverSpace(space)
        setPopoverBoard(board)
    }

    const spaceClick = (space, e) => {
        e.preventDefault()
        setSpacePopoverAnchor(e.currentTarget)
        setPopoverSpace(space)
    }

    const boardPopoverClose = () => {
        setBoardPopoverAnchor(null)
    }

    const spacePopoverClose = () => {
        setSpacePopoverAnchor(null)
    }

    const handleNewBoardClick = (space) => {
        setNewBoardSpace(space._id)
        resetNewBoardName()
    }

    const handleNewSpace = async () => {
        await axios({
            method: 'POST',
            withCredentials: true,
            data: {
                name: newSpaceName
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/space/${workspace._id}`
        }).then(() => {
            getData()
            resetNewSpaceDialogOpen()
        }).catch(err => {
            toast(err.toString())
        })
    }

    const handleNewBoard = async () => {
        if (newBoardName === '') {
            resetNewBoardSpace()
            return
        }

        await axios({
            method: 'POST',
            withCredentials: true,
            data: {
                name: newBoardName
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${workspace._id}/${newBoardSpace}`
        }).then(() => {
            getData()
            resetNewBoardSpace()
        }).catch(err => {
            toast(err.toString())
        })
    }

    const handleBoardEditClick = (workspace, space, board) => {
        setEditingBoard(board._id)
    }

    const handleSpaceEditClick = (workspace, space) => {
        setEditingSpace(space._id)
    }

    const handleBoardEdit = async () => {
        if (editingBoardName === '') return setEditingBoard('')

        await axios({
            method: 'PATCH',
            withCredentials: true,
            data: {
                name: editingBoardName
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${editingBoard}`
        }).then(() => {
            getData()
            setEditingBoard('')
        }).catch(err => {
            toast(err.toString())
        })
    }

    const handleSpaceEdit = async () => {
        if (editingSpaceName === '') return setEditingSpace('')

        await axios({
            method: 'PATCH',
            withCredentials: true,
            data: {
                name: editingSpaceName
            },
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/space/${workspace._id}/${editingSpace}`
        }).then(() => {
            getData()
            setEditingSpace('')
        }).catch(err => {
            toast(err.toString())
        })
    }

    const toggleClosed = (x) => {
        if (editingSpace === x) return

        const newSpacesClosed = spacesClosed
        const xIndex = newSpacesClosed.indexOf(x)

        if (xIndex !== -1) newSpacesClosed.splice(xIndex, 1)
        else newSpacesClosed.push(x)

        setSpacesClosed([...newSpacesClosed])
    }

    const toggleSpaces = () => {
        setSpaceTabOpen(!spaceTabOpen)
    }

    const handleDragStart = () => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'pointer'
    }

    const handleDragEnd = async (result) => {
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
                url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/drag/${workspace._id}`
            }).then(() => {
                getData()
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
                url: `${process.env.REACT_APP_BACKEND_HOST}/api/space/drag/${workspace._id}`
            }).then(() => {
                getData()
            }).catch(err => {
                toast(err.toString())
            })
        }
    }

    const renderSpaces = () => workspace.spaces.map((space, i) => (
            <Draggable draggableId={space._id} key={space._id} index={i}>
                {(provided) => (
                    <div className="space" {...provided.draggableProps} ref={provided.innerRef}>
                        <div className="space-title" {...provided.dragHandleProps}>
                            <div>
                                <i className={`fas fa-caret-right ${spacesClosed.includes(space._id) ? '' : 'open'}`}> </i>
                            </div>
                            <div onClick={() => toggleClosed(space._id)}>
                                <div className="space-icon">{space.name.charAt(0).toUpperCase()}</div>
                                {space._id === editingSpace ?
                                    (
                                        <input type="text"
                                               className='space'
                                               defaultValue={space.name}
                                               onKeyUp={e => {if ((e.key === 'Escape') || (e.key === 'Enter')) e.currentTarget.blur()}}
                                               onBlur={handleSpaceEdit}
                                               onChange={changeEditingSpaceName}
                                               name="editingSpaceName"
                                               autoFocus />
                                    ) : (
                                        <p>{space.name}</p>
                                    )}
                            </div>
                            <div>
                                <i className="fas fa-ellipsis-h" onClick={e => spaceClick(space, e)}> </i>
                                <i onClick={() => handleNewBoardClick(space)}
                                   className="fas fa-plus"> </i>
                            </div>
                        </div>

                        <AnimateHeight
                            className="space-boards"
                            duration={200}
                            height={spacesClosed.includes(space._id) ? 0 : 'auto'}>
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
                                                            to={`/${props.url.replaceAll('/', '')}/${space.name.replaceAll(' ', '-')}/${board.name.replaceAll(' ', '-')}`}
                                                            activeClassName="active-board">
                                                            <div> </div>
                                                            {board._id === editingBoard ?
                                                                (
                                                                    <input type="text"
                                                                           className='board'
                                                                           defaultValue={board.name}
                                                                           onKeyUp={e => {if ((e.key === 'Escape') || (e.key === 'Enter')) e.currentTarget.blur()}}
                                                                           onBlur={handleBoardEdit}
                                                                           onChange={changeEditingBoardName}
                                                                           name="editingBoardName"
                                                                           autoFocus />
                                                                ) : (
                                                                    <p>{board.name}</p>
                                                                )}
                                                            <i className="fas fa-ellipsis-h" onClick={e => boardClick(space, board, e)}> </i>
                                                        </NavLink>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                        {newBoardSpace === space._id && (
                                            <div>
                                                <div> </div>
                                                <input type="text"
                                                       className='board'
                                                       onKeyUp={e => {if ((e.key === 'Escape') || (e.key === 'Enter')) e.currentTarget.blur()}}
                                                       onBlur={handleNewBoard}
                                                       onChange={changeNewBoardName}
                                                       name="newBoardName"
                                                       autoFocus />
                                                <i className="fas fa-ellipsis-h"> </i>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </AnimateHeight>
                    </div>
                )}
            </Draggable>
        )
    )

    if (!workspace) return <></>
    return (
        <div className={`SideBar ${props.sideBarClosed ? 'closed' : ''}`}>
            <div className="header">
                <div className="logo">
                    <Link to={props.url}>
                        <p>Task Board</p>
                    </Link>
                </div>
                <div className="icons">
                    {workspace.members
                        ? <Link to={`/settings/${workspace.id}/general`}><i className="fas fa-cog"> </i></Link>
                        : null}
                    <i className="fas fa-angle-double-left" onClick={props.toggleSideBar}> </i>
                </div>
            </div>
            <div className="boards">
                <div onClick={toggleSpaces} className="section-name">
                    <label>Spaces</label>
                    <i style={{transition: 'transform 0.2s', transform: spaceTabOpen ? 'rotate(360deg)' : 'rotate(270deg)'}} className="fas fa-angle-down"> </i>
                </div>

                <AnimateHeight
                    className="spaces"
                    duration={200}
                    height={spaceTabOpen ? 'auto' : 0}
                >
                    <div className="new-btn">
                        <button onClick={changeNewSpaceDialogOpen}><i
                            className="fas fa-plus"> </i>New Space
                        </button>
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

                    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <Droppable droppableId="spaces" type="space">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {renderSpaces()}
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
                <AccountPopOver history={props.history} />
            </div>

            {/* create space dialog*/}
            <Dialog
                open={newSpaceDialogOpen}
                onClose={changeNewSpaceDialogOpen}
                aria-labelledby="form-dialog-title"
                fullWidth={true}>
                <DialogTitle id="form-dialog-title">Add new Space</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        value={newSpaceName}
                        onChange={changeNewSpaceName}
                        label="Space name"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={changeNewSpaceDialogOpen} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleNewSpace} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {editingBoard === '' && (
                <BoardPopover
                    handleEditClick={handleBoardEditClick}
                    anchor={boardPopoverAnchor}
                    workspace={workspace}
                    space={popoverSpace}
                    board={popoverBoard}
                    getData={getData}
                    handleClose={boardPopoverClose} />
            )}

            {editingSpace === '' && (
                <SpacePopover
                    handleEditClick={handleSpaceEditClick}
                    anchor={spacePopoverAnchor}
                    workspace={workspace}
                    space={popoverSpace}
                    getData={getData}
                    handleClose={spacePopoverClose} />
            )}

        </div>
    );
}

export default SideBar