import {Fragment, useContext, useState} from 'react'
import './assets/Task.css'
import axios from "axios";
import TaskColumnPopover from "./TaskColumnPopover";
import {Draggable} from "react-beautiful-dnd";
import TaskPopover from "./TaskPopover";
import useInputState from "../../hooks/useInputState";
import BoardContext from "../../context/BoardContext";

function Task(props) {
    const {board, getBoardData} = useContext(BoardContext)
    const [anchor, setAnchor] = useState(null)
    const [activeOption, setActiveOption] = useState('')
    const [columnDialogOpen, setColumnDialogOpen] = useState(false)
    const [moreDialogOpen, setMoreDialogOpen] = useState(false)

    const [taskEditing, setTaskEditing] = useState(false)
    const [taskName, changeTaskName] = useInputState(props.task.name)

    const handleClose = () => {
        setAnchor(null)
        setMoreDialogOpen(false)
        setColumnDialogOpen(false)
    }

    const handleClick = (e, key) => {
        setAnchor(e.currentTarget)
        setActiveOption(key._id)
        setColumnDialogOpen(!columnDialogOpen)
    }

    const handleMoreClick = (e) => {
        setAnchor(e.currentTarget)
        setMoreDialogOpen(!moreDialogOpen)
    }

    const handleTextEdit = async (e) => {
        const {taskGroupId, task} = props
        axios({
            method: 'PATCH',
            data: {
                column: e.target.name,
                value: e.target.value,
                type: 'text'
            },
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${board._id}/${taskGroupId}/${task._id}`
        }).then(() => {
            getBoardData()
        })
    }

    const getStatusLabel = (attribute) => {
        let taskOption = props.task.options.find(x => x.column === attribute._id)
        let label

        if (taskOption) {
            label = attribute.labels.find(x => x._id === taskOption.value)
        } else label = {color: 'rgb(196,196,196)', name: ''}

        if (!label) label = {color: 'rgb(196,196,196)', name: ''}

        return (
            <Fragment key={attribute._id}>
                <div
                    onClick={(e) => handleClick(e, attribute)}
                    style={{backgroundColor: label.color}}>
                    {label.name}
                </div>
                {attribute._id.toString() === activeOption && (
                    <TaskColumnPopover
                        attribute={attribute}
                        anchor={anchor}
                        open={columnDialogOpen}
                        task={props.task}
                        taskGroupId={props.taskGroupId}
                        handleClose={handleClose}/>)}
            </Fragment>
        )
    }

    const getTextLabel = (attribute) => {
        let taskOption = props.task.options.find(x => x.column === attribute._id)
        if (!taskOption) taskOption = { value: '' }
        return (
            <div style={{backgroundColor: 'transparent'}} key={attribute._id}>
                <input type="text" name={attribute._id} onBlur={handleTextEdit} defaultValue={taskOption.value}/>
            </div>
        )
    }

    const toggleTaskEdit = () => {
        setTaskEditing(!taskEditing)
    }

    const handleTaskEdit = (e) => {
        e.preventDefault()
        const {taskGroupId, task} = props
        toggleTaskEdit()
        axios({
            method: 'PATCH',
            data: {
                type: 'name',
                name: taskName
            },
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/${board._id}/${taskGroupId}/${task._id}`
        }).then(() => {
            getBoardData()
        })
    }

    return (
        <>
            <Draggable draggableId={props.task._id} index={props.index} type="task">
                {(provided) => (
                    <div className={`Task ${taskEditing ? 'editing' : ''}`} {...provided.draggableProps}
                         ref={provided.innerRef} {...provided.dragHandleProps}>
                        {taskEditing
                            ? (
                                <form onSubmit={handleTaskEdit} onBlur={handleTaskEdit}>
                                    <input type={taskName}
                                           onKeyUp={e => {
                                               if (e.key === 'Escape') e.currentTarget.blur()
                                           }}
                                           value={taskName}
                                           onChange={changeTaskName}
                                           name="taskName" autoFocus/>
                                </form>
                            )
                            : <p>{props.task.name}</p>}
                        <div>
                            {board.attributes.map(attribute => {

                                if (attribute.type === "status") return getStatusLabel(attribute)
                                if (attribute.type === "text") return getTextLabel(attribute)

                                return (
                                    <div style={{backgroundColor: 'crimson'}} key={Math.random()}>
                                        ERROR
                                    </div>
                                )
                            })}

                            <div onClick={handleMoreClick}>
                                <i className="fas fa-ellipsis-h"> </i>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>

            {!taskEditing && <TaskPopover
                toggleTaskEdit={toggleTaskEdit}
                open={moreDialogOpen}
                anchor={anchor}
                handleClose={handleClose}
                taskGroupId={props.taskGroupId}
                task={props.task}/>}
        </>
    );
}

export default Task