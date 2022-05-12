import {useContext, useState} from 'react'
import '../../../styles/TaskGroup.css'
import Task from './taskGroup/Task'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Draggable, Droppable} from "react-beautiful-dnd";
import AttributePopover from "./taskGroup/AttributePopover";
import AddAttributePopover from "./taskGroup/AddAttributePopover";
import useInputState from "../../../modules/hooks/useInputState";
import BoardContext from "../../../modules/context/BoardContext";
import useToggleState from "../../../modules/hooks/useToggleState";
import {useDispatch, useSelector} from "react-redux";
import { addTask, deleteTaskGroup, editTaskGroupName } from "../../../modules/state/reducers/boardReducer";
import {ObjectId} from "../../../utils";

function TaskGroup(props) {
    const { board } = useSelector(state => state.board)
    const dispatch = useDispatch()
    const { getBoardData } = useContext(BoardContext)

    // new task input
    const [newTaskName, changeNewTaskName, resetNewTaskName] = useInputState('')

    // name editing
    const [editing, toggleEditing] = useToggleState(false)
    const [editingName, changeEditingName, resetEditingName] = useInputState(props.taskGroup.name)

    // delete confirmation
    const [deleteDialogOpen, toggleDeleteDialogOpen] = useToggleState(false)

    // attribute popover
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [popoverId, setPopoverId] = useState('')

    // add new attribute popover
    const [newAttributeOpen, setNewAttributeOpen] = useState(false)

    const handleAddNewAttribute = (e = false) => {
        setNewAttributeOpen(e ? e.target.parentNode.parentNode : false)
    }

    const handleAddTask = async (e) => {
        e.preventDefault()
        resetNewTaskName()
        dispatch(addTask({
            boardId: board._id,
            taskGroupId: props.taskGroup._id,
            newTaskName,
            _id: ObjectId()
        }))
    }

    const handleAttributePopover = (e, id = null) => {
        setPopoverId(id ? id : popoverId)
        setPopoverOpen(e ? e.target.parentNode : null)
    }

    const handleDelete = async () => {
        dispatch(deleteTaskGroup({
            boardId: board._id,
            taskGroupId: props.taskGroup._id,
        }))
    }

    const updateName = async (e) => {
        e.preventDefault()
        toggleEditing()
        dispatch(editTaskGroupName({
            boardId: board._id,
            taskGroupId: props.taskGroup._id,
            name: editingName
        }))
    }

    const cancelNameEditing = () => {
        toggleEditing()
        resetEditingName()
    }

    return (
        <Draggable draggableId={props.taskGroup._id} index={props.index}>
            {(provided) => (
                <div className="task" {...provided.draggableProps} ref={provided.innerRef}>
                    <div className="title">
                        <div {...provided.dragHandleProps}>
                            {editing ? (
                                <div className="taskGroup-title editing">
                                    <form onSubmit={updateName} onBlur={updateName}>
                                        <input
                                            onKeyUp={e => {
                                                if (e.key === 'Escape') e.currentTarget.blur()
                                            }}
                                            type="text"
                                            name="editingName"
                                            value={editingName}
                                            onChange={changeEditingName}
                                            autoFocus/>
                                        <div>
                                            <i onClick={cancelNameEditing} className="fas fa-times"> </i>
                                            <i onClick={updateName} className="fas fa-check"> </i>
                                        </div>
                                    </form>
                                </div>) : (
                                <div className="taskGroup-title">
                                    <p>{props.taskGroup.name}</p>
                                    <i className="fas fa-pen" onClick={toggleEditing}> </i>
                                    <i onClick={toggleDeleteDialogOpen} className="fas fa-trash-alt"> </i>
                                </div>)}
                            <p className="task-amount">{props.taskGroup.tasks.length} TASKS</p>
                        </div>
                        <Droppable
                            droppableId={props.taskGroup._id + 'attribute'}
                            direction="horizontal"
                            type={`attribute ${props.taskGroup._id}`}>
                            {(provided) => (
                                <div className="attributes" {...provided.droppableProps} ref={provided.innerRef}>
                                    {board.attributes.map((x, i) => {
                                        return (
                                            <Draggable
                                                draggableId={props.taskGroup._id + x._id}
                                                index={i}
                                                key={props.taskGroup._id + x._id}>
                                                {(provided) => (
                                                    <div
                                                        className="attribute"
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}>
                                                        <i className="fas fa-caret-down"> </i>
                                                        <p>{x.name}</p>
                                                        <i className="fas fa-caret-down"
                                                           onClick={e => handleAttributePopover(e, x)}> </i>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                    <div className="attribute">
                                        <p><i
                                            onClick={handleAddNewAttribute}
                                            className="fas fa-plus-circle"> </i></p>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <Droppable droppableId={props.taskGroup._id} type="task">
                        {(provided) => (
                            <div className="tasks" ref={provided.innerRef} {...provided.droppableProps}>
                                {props.taskGroup.tasks.map((task, i) => {
                                    return (
                                        <Task
                                            key={task._id}
                                            task={task}
                                            index={i}
                                            taskGroupId={props.taskGroup._id} />
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <form onSubmit={handleAddTask}>
                        <div className="new-task">
                            <input
                                type="text"
                                placeholder="+ New Task"
                                value={newTaskName}
                                name="newTask"
                                onChange={changeNewTaskName}/>
                            {newTaskName ? <button>SAVE</button> : null}
                        </div>
                    </form>

                    <Dialog
                        open={deleteDialogOpen}
                        onClose={toggleDeleteDialogOpen}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle
                            id="alert-dialog-title">{`Delete ${props.taskGroup.name} group?`}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                All tasks within this Group will be deleted.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={toggleDeleteDialogOpen} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} color="primary" variant="contained">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <AttributePopover
                        getData={getBoardData}
                        boardId={board._id}
                        open={popoverOpen}
                        close={handleAttributePopover}
                        attr={popoverId}/>
                    <AddAttributePopover
                        getData={getBoardData}
                        boardId={board._id}
                        anchor={newAttributeOpen}
                        close={handleAddNewAttribute}/>
                </div>
            )}
        </Draggable>
    );
}

export default TaskGroup