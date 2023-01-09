import React, { useState } from 'react'
import '../../styles/SideBar.css'
import { Link, NavLink, useParams } from 'react-router-dom'
import AccountPopOver from './sideBar/AccountPopover'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Tooltip
} from '@mui/material'
import Button from '@mui/material/Button'
import AnimateHeight from 'react-animate-height'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import BoardPopover from './sideBar/BoardPopover'
import SpacePopover from './sideBar/SpacePopover'
import useLocalStorageState from '../../modules/hooks/useLocalStorageState.tsx'
import useInputState from '../../modules/hooks/useInputState.tsx'
import useToggleState from '../../modules/hooks/useToggleState.tsx'
import { ObjectId } from '../../utils'
import {
    useAddBoardMutation,
    useAddSpaceMutation,
    useEditBoardNameMutation,
    useEditSpaceNameMutation,
    useFetchWorkspaceQuery,
    useSortBoardMutation,
    useSortSpaceMutation
} from '../../modules/services/workspaceSlice'
import { useFetchUserQuery } from '../../modules/services/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function SideBar(props) {
    const [addBoard] = useAddBoardMutation()
    const [addSpace] = useAddSpaceMutation()
    const [editBoardName] = useEditBoardNameMutation()
    const [editSpaceName] = useEditSpaceNameMutation()
    const [sortBoard] = useSortBoardMutation()
    const [sortSpace] = useSortSpaceMutation()

    // new space dialog
    const [
        newSpaceDialogOpen,
        changeNewSpaceDialogOpen,
        resetNewSpaceDialogOpen
    ] = useToggleState(false)
    const [newSpaceName, changeNewSpaceName, resetNewSpaceName] =
        useInputState('')

    // localstorage space opened state
    const [spaceTabOpen, setSpaceTabOpen] = useLocalStorageState(
        'spaceTabOpen',
        true
    )
    const [spacesClosed, setSpacesClosed] = useLocalStorageState(
        'spacesClosed',
        []
    )

    // popover dialogs
    const [boardPopoverAnchor, setBoardPopoverAnchor] = useState(null)
    const [spacePopoverAnchor, setSpacePopoverAnchor] = useState(null)
    const [popoverSpace, setPopoverSpace] = useState('')
    const [popoverBoard, setPopoverBoard] = useState('')

    // new board
    const [newBoardSpace, , resetNewBoardSpace, setNewBoardSpace] =
        useInputState('')
    const [newBoardName, changeNewBoardName, resetNewBoardName] =
        useInputState('')

    // editing
    const [editingBoard, setEditingBoard] = useState('')
    const [editingSpace, setEditingSpace] = useState('')
    const [editingBoardName, changeEditingBoardName] = useInputState('')
    const [editingSpaceName, changeEditingSpaceName] = useInputState('')

    // workspace
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data: user } = useFetchUserQuery()

    const boardClick = (space, board, e) => {
        e.preventDefault()
        setBoardPopoverAnchor(e.currentTarget)
        setPopoverSpace(space)
        setPopoverBoard(board)
    }

    const spaceClick = (space, e) => {
        e.preventDefault()
        e.stopPropagation()
        setSpacePopoverAnchor(e.currentTarget)
        setPopoverSpace(space)
    }

    const boardPopoverClose = () => {
        setBoardPopoverAnchor(null)
    }

    const spacePopoverClose = () => {
        setSpacePopoverAnchor(null)
    }

    const handleNewBoardClick = (space, e) => {
        e.stopPropagation()
        if (spacesClosed.includes(space._id)) toggleClosed(space._id)
        setNewBoardSpace(space._id)
        resetNewBoardName()
    }

    const handleNewSpace = async () => {
        resetNewSpaceDialogOpen()
        resetNewSpaceName()
        addSpace({
            workspaceId: workspace._id,
            workspaceIdFriendly: workspace.id,
            _id: ObjectId(),
            name: newSpaceName.replaceAll(/[^a-zA-Z0-9_$<>!=´`+*&() ]/g, '')
        })
    }

    const handleNewBoard = async () => {
        if (newBoardName === '') {
            resetNewBoardSpace()
            return
        }

        resetNewBoardSpace()
        resetNewBoardName()
        addBoard({
            workspaceId: workspace._id,
            workspaceIdFriendly: workspace.id,
            spaceId: newBoardSpace,
            name: newBoardName.replaceAll(/[^a-zA-Z0-9_$<>!=´`+*&() ]/g, ''),
            _id: ObjectId()
        })
    }

    const handleBoardEditClick = (workspace, space, board) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        setTimeout(() => {
            setEditingBoard({ spaceId: space._id, boardId: board._id })
        }, 1)
    }

    const handleSpaceEditClick = (workspace, space) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        setTimeout(() => {
            setEditingSpace(space._id)
        }, 1)
    }

    const handleBoardEdit = async () => {
        setEditingBoard('')
        if (editingBoardName === '') return
        editBoardName({
            ...editingBoard,
            name: editingBoardName.replaceAll(
                /[^a-zA-Z0-9_$<>!=´`+*&() ]/g,
                ''
            ),
            workspaceIdFriendly: workspace.id,
            workspaceId: workspace._id
        })
    }

    const handleSpaceEdit = async () => {
        if (editingSpaceName === '') return setEditingSpace('')

        editSpaceName({
            workspaceId: workspace._id,
            workspaceIdFriendly: workspace.id,
            spaceId: editingSpace,
            name: editingSpaceName.replaceAll(/[^a-zA-Z0-9_$<>!=´`+*&() ]/g, '')
        })
        setEditingSpace('')
    }

    const toggleClosed = x => {
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

    const handleDragEnd = async result => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'auto'
        if (
            result.destination === null ||
            (result.destination.index === result.source.index &&
                result.destination.droppableId === result.source.droppableId)
        )
            return
        if (result.type === 'board') {
            sortBoard({
                workspaceId: workspace._id,
                workspaceIdFriendly: workspace.id,
                result
            })
        } else if (result.type === 'space') {
            sortSpace({
                workspaceId: workspace._id,
                workspaceIdFriendly: workspace.id,
                result
            })
        }
    }

    const renderSpaces = () =>
        workspace.spaces.map((space, i) => (
            <Draggable draggableId={space._id} key={space._id} index={i}>
                {provided => (
                    <div
                        className="space"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <div
                            className="space-title"
                            {...provided.dragHandleProps}
                            onClick={() => toggleClosed(space._id)}
                        >
                            <div>
                                <FontAwesomeIcon
                                    className={
                                        spacesClosed.includes(space._id)
                                            ? ''
                                            : 'open'
                                    }
                                    icon={solid('caret-right')}
                                />
                            </div>
                            <div>
                                <div className="space-icon">
                                    {space.name.charAt(0).toUpperCase()}
                                </div>
                                {space._id === editingSpace ? (
                                    <input
                                        type="text"
                                        className="space text-[13px] text-[#292d34]"
                                        defaultValue={space.name}
                                        onKeyUp={e => {
                                            if (
                                                e.key === 'Escape' ||
                                                e.key === 'Enter'
                                            )
                                                e.currentTarget.blur()
                                        }}
                                        onBlur={handleSpaceEdit}
                                        onChange={changeEditingSpaceName}
                                        name="editingSpaceName"
                                        autoFocus
                                    />
                                ) : (
                                    <Tooltip
                                        disableInteractive
                                        title={space.name}
                                        placement="top"
                                        arrow
                                    >
                                        <p className="text-[14px] text-[#292d34] font-semibold truncate max-w-[159px]">
                                            {space.name}
                                        </p>
                                    </Tooltip>
                                )}
                            </div>
                            <div className="flex flex-row">
                                <div className="h-full w-5 flex justify-center items-center">
                                    <FontAwesomeIcon
                                        onClick={e => spaceClick(space, e)}
                                        icon={solid('ellipsis-h')}
                                    />
                                </div>
                                <div className="h-full w-5 flex justify-center items-center">
                                    <FontAwesomeIcon
                                        onClick={e =>
                                            handleNewBoardClick(space, e)
                                        }
                                        icon={solid('plus')}
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimateHeight
                            className="space-boards"
                            duration={200}
                            height={
                                spacesClosed.includes(space._id) ? 0 : 'auto'
                            }
                        >
                            <Droppable droppableId={space._id} type="board">
                                {provided => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {space.boards.map((board, i) => {
                                            return (
                                                <Draggable
                                                    key={board._id}
                                                    draggableId={board._id}
                                                    index={i}
                                                >
                                                    {provided => (
                                                        <NavLink
                                                            {...provided.draggableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.dragHandleProps}
                                                            className={({
                                                                isActive
                                                            }) =>
                                                                isActive
                                                                    ? ' active-board'
                                                                    : ''
                                                            }
                                                            to={`/${props.url.replaceAll(
                                                                '/',
                                                                ''
                                                            )}/${space.name.replaceAll(
                                                                ' ',
                                                                '-'
                                                            )}/${board.name.replaceAll(
                                                                ' ',
                                                                '-'
                                                            )}`}
                                                        >
                                                            <div> </div>
                                                            {board._id ===
                                                            editingBoard.boardId ? (
                                                                <input
                                                                    type="text"
                                                                    className="board text-[13px] text-[#292d34]"
                                                                    defaultValue={
                                                                        board.name
                                                                    }
                                                                    onKeyUp={e => {
                                                                        if (
                                                                            e.key ===
                                                                                'Escape' ||
                                                                            e.key ===
                                                                                'Enter'
                                                                        )
                                                                            e.currentTarget.blur()
                                                                    }}
                                                                    onBlur={
                                                                        handleBoardEdit
                                                                    }
                                                                    onChange={
                                                                        changeEditingBoardName
                                                                    }
                                                                    name="editingBoardName"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <Tooltip
                                                                    disableInteractive
                                                                    title={
                                                                        board.name
                                                                    }
                                                                    placement="top"
                                                                    arrow
                                                                >
                                                                    <p className="text-[13px] text-[#292d34] truncate max-w-[180px]">
                                                                        {
                                                                            board.name
                                                                        }
                                                                    </p>
                                                                </Tooltip>
                                                            )}
                                                            <div className="flex justify-center items-center w-5 mr-5 ml-auto opacity-0 cursor-pointer text-[0.8rem]">
                                                                <FontAwesomeIcon
                                                                    onClick={e =>
                                                                        boardClick(
                                                                            space,
                                                                            board,
                                                                            e
                                                                        )
                                                                    }
                                                                    icon={solid(
                                                                        'ellipsis-h'
                                                                    )}
                                                                />
                                                            </div>
                                                        </NavLink>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                        {newBoardSpace === space._id && (
                                            <div>
                                                <div> </div>
                                                <input
                                                    type="text"
                                                    className="board text-[13px] text-[#292d34]"
                                                    onKeyUp={e => {
                                                        if (
                                                            e.key ===
                                                                'Escape' ||
                                                            e.key === 'Enter'
                                                        )
                                                            e.currentTarget.blur()
                                                    }}
                                                    onBlur={handleNewBoard}
                                                    onChange={
                                                        changeNewBoardName
                                                    }
                                                    name="newBoardName"
                                                    autoFocus
                                                />
                                                <FontAwesomeIcon
                                                    icon={solid('ellipsis-h')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </AnimateHeight>
                    </div>
                )}
            </Draggable>
        ))

    if (!workspace) return <></>
    return (
        <div className={`SideBar ${props.sideBarClosed ? 'closed' : ''}`}>
            <div className="header">
                <div className="logo">
                    <Link
                        to={props.url}
                        className="flex flex-row justify-center items-center"
                    >
                        <img
                            src="/assets/favicon-96x96.png"
                            className="h-6 w-6 mr-2"
                            alt="logo"
                        />
                        <p>Tablane</p>
                    </Link>
                </div>
                <div className="icons">
                    <FontAwesomeIcon
                        onClick={props.toggleSideBar}
                        icon={solid('angle-double-left')}
                    />
                </div>
            </div>
            <div className="menus">
                <NavLink
                    className={({ isActive }) =>
                        'home' + (isActive ? ' active' : '')
                    }
                    to={`/${workspace.id}`}
                    end
                >
                    <div className="icon text-[#53575e]">
                        <FontAwesomeIcon icon={solid('house')} />
                    </div>
                    <span className="text-[14px] text-[#53575e]">Home</span>
                </NavLink>
                {/*<NavLink*/}
                {/*    className={({ isActive }) =>*/}
                {/*        'notifications' + (isActive ? ' active' : '')*/}
                {/*    }*/}
                {/*    to={`/${workspace.id}/notifications`}*/}
                {/*>*/}
                {/*    <div className="icon text-[#53575e]">*/}
                {/*        <FontAwesomeIcon icon={solid('bell')} />*/}
                {/*        {user?.newNotifications > 0 && (*/}
                {/*            <span className="indicator">*/}
                {/*                {user?.newNotifications}*/}
                {/*            </span>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*    <span className="text-[14px] text-[#53575e]">*/}
                {/*        Notifications*/}
                {/*    </span>*/}
                {/*</NavLink>*/}
            </div>
            <div className="boards">
                <div onClick={toggleSpaces} className="section-name">
                    <label>Spaces</label>
                    <FontAwesomeIcon
                        style={{
                            transition: 'transform 0.2s',
                            transform: spaceTabOpen
                                ? 'rotate(0deg)'
                                : 'rotate(90deg)'
                        }}
                        icon={solid('angle-down')}
                    />
                </div>

                <AnimateHeight
                    className="spaces"
                    duration={200}
                    height={spaceTabOpen ? 'auto' : 0}
                >
                    <div className="new-btn text-[11px] font-semibold text-[#7c828d]">
                        <button onClick={changeNewSpaceDialogOpen}>
                            <FontAwesomeIcon icon={solid('plus')} />
                            New Space
                        </button>
                    </div>
                    <div className="space">
                        {/*<div className="space-title">*/}
                        {/*    <div> </div>*/}
                        {/*    <div>*/}
                        {/*        <div className="space-icon">*/}
                        {/*            <FontAwesomeIcon icon={solid('th-large')} />*/}
                        {/*        </div>*/}
                        {/*        <p className="text-[14px]">Everything</p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>

                    <DragDropContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <Droppable droppableId="spaces" type="space">
                            {provided => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
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
                    <FontAwesomeIcon icon={solid('angle-down')} />
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
                fullWidth={true}
            >
                <DialogTitle id="form-dialog-title">Add new Space</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        value={newSpaceName}
                        onChange={changeNewSpaceName}
                        onKeyUp={e => {
                            if (e.key === 'Enter') {
                                handleNewSpace()
                            }
                        }}
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
                    handleClose={boardPopoverClose}
                />
            )}

            {editingSpace === '' && (
                <SpacePopover
                    handleEditClick={handleSpaceEditClick}
                    anchor={spacePopoverAnchor}
                    workspace={workspace}
                    space={popoverSpace}
                    handleClose={spacePopoverClose}
                />
            )}
        </div>
    )
}

export default SideBar
