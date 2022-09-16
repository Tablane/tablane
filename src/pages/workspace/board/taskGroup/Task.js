import { Fragment, useState } from 'react'
import '../../../../styles/Task.css'
import TaskColumnPopover from './task/TaskColumnPopover'
import { Draggable } from '@hello-pangea/dnd'
import TaskPopover from './task/TaskPopover'
import useInputState from '../../../../modules/hooks/useInputState'
import { useDispatch } from 'react-redux'
import {
    editOptionsTask,
    editTaskField
} from '../../../../modules/state/reducers/boardReducer'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import TaskModal from './TaskModal'
import PersonColumnPopover from './task/PersonColumnPopover'
import { Tooltip } from '@mui/material'
import { useFetchWorkspaceQuery } from '../../../../modules/state/services/workspaceSlice'

function Task(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { taskId, workspace: workspaceId } = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(workspaceId)
    const [anchor, setAnchor] = useState(null)
    const [activeOption, setActiveOption] = useState('')
    const [columnDialogOpen, setColumnDialogOpen] = useState(false)
    const [moreDialogOpen, setMoreDialogOpen] = useState(false)

    const [taskEditing, setTaskEditing] = useState(false)
    const [taskName, changeTaskName] = useInputState(props.task.name)

    const openTaskModal = () => {
        if (taskEditing) return
        navigate(`${location.pathname}/${props.task._id}`)
    }

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

    const handleMoreClick = e => {
        setAnchor(e.currentTarget)
        setMoreDialogOpen(!moreDialogOpen)
    }

    const handleTextEdit = async e => {
        const { task } = props
        if (
            task.options.find(option => option.column === e.target.name)
                ?.value === e.target.value
        )
            return

        dispatch(
            editOptionsTask({
                column: e.target.name,
                value: e.target.value,
                type: 'text',
                boardId: props.board._id,
                taskId: task._id
            })
        )
    }

    const getStatusLabel = attribute => {
        let taskOption = props.task.options.find(
            x => x.column === attribute._id
        )
        let label

        if (taskOption) {
            label = attribute.labels.find(x => x._id === taskOption.value)
        } else label = { color: 'rgb(196,196,196)', name: '' }

        if (!label) label = { color: 'rgb(196,196,196)', name: '' }

        return (
            <Fragment key={attribute._id}>
                <div
                    onClick={e => handleClick(e, attribute)}
                    style={{ backgroundColor: label.color }}
                >
                    {label.name}
                </div>
                {attribute._id.toString() === activeOption && (
                    <TaskColumnPopover
                        attribute={attribute}
                        anchor={anchor}
                        open={columnDialogOpen}
                        task={props.task}
                        taskGroupId={props.taskGroupId}
                        handleClose={handleClose}
                    />
                )}
            </Fragment>
        )
    }

    const getTextLabel = attribute => {
        let taskOption = props.task.options.find(
            x => x.column === attribute._id
        )
        if (!taskOption) taskOption = { value: '' }
        return (
            <div style={{ backgroundColor: 'transparent' }} key={attribute._id}>
                <input
                    type="text"
                    name={attribute._id}
                    onBlur={handleTextEdit}
                    defaultValue={taskOption.value}
                />
            </div>
        )
    }

    const getPersonLabel = attribute => {
        let taskOption = props.task.options.find(
            x => x.column === attribute._id
        )

        const people = []
        if (taskOption) {
            taskOption.value.map(userId => {
                const person = workspace.members.find(
                    ({ user }) => user._id === userId
                )
                if (person) people.push(person.user)
            })
        }

        return (
            <Fragment key={attribute._id}>
                {people.length > 0 ? (
                    <div
                        className="people"
                        onClick={e => handleClick(e, attribute)}
                    >
                        {people.map((person, i) => {
                            return (
                                <Tooltip
                                    title={person.username}
                                    key={person._id}
                                    arrow
                                >
                                    <div style={{ zIndex: people.length - i }}>
                                        <div className="person">
                                            {person.username
                                                .charAt(0)
                                                .toUpperCase()}
                                            {person.username
                                                .charAt(1)
                                                .toUpperCase()}
                                        </div>
                                    </div>
                                </Tooltip>
                            )
                        })}
                    </div>
                ) : (
                    <div
                        className="people"
                        onClick={e => handleClick(e, attribute)}
                    >
                        <i className="fa-regular fa-circle-user"></i>
                    </div>
                )}
                {attribute._id.toString() === activeOption && (
                    <PersonColumnPopover
                        boardId={props.board._id}
                        attribute={attribute}
                        people={people}
                        taskOption={taskOption}
                        anchor={anchor}
                        open={columnDialogOpen}
                        task={props.task}
                        handleClose={handleClose}
                    />
                )}
            </Fragment>
        )
    }

    const toggleTaskEdit = () => {
        document.activeElement.blur()
        setTimeout(() => setTaskEditing(!taskEditing), 0)
    }

    const handleTaskEdit = e => {
        e.preventDefault()
        const { task } = props
        toggleTaskEdit()
        dispatch(
            editTaskField({
                type: 'name',
                value: taskName,
                boardId: props.board._id,
                taskId: task._id
            })
        )
    }

    return (
        <>
            <Draggable
                draggableId={props.task._id}
                index={props.index}
                type="task"
            >
                {provided => (
                    <div
                        className={`Task ${taskEditing ? 'editing' : ''}`}
                        {...provided.draggableProps}
                        onClick={openTaskModal}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                    >
                        {taskEditing ? (
                            <form
                                onSubmit={handleTaskEdit}
                                onBlur={handleTaskEdit}
                            >
                                <input
                                    type={taskName}
                                    onKeyUp={e => {
                                        if (e.key === 'Escape')
                                            e.currentTarget.blur()
                                    }}
                                    value={taskName}
                                    onChange={changeTaskName}
                                    name="taskName"
                                    autoFocus
                                />
                            </form>
                        ) : (
                            <p>{props.task.name}</p>
                        )}
                        <div onClick={e => e.stopPropagation()}>
                            {props.board.attributes.map(attribute => {
                                if (attribute.type === 'status')
                                    return getStatusLabel(attribute)
                                if (attribute.type === 'text')
                                    return getTextLabel(attribute)
                                if (attribute.type === 'people') {
                                    return getPersonLabel(attribute)
                                }

                                return (
                                    <div
                                        style={{ backgroundColor: 'crimson' }}
                                        key={Math.random()}
                                    >
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

            {!taskEditing && (
                <TaskPopover
                    board={props.board}
                    toggleTaskEdit={toggleTaskEdit}
                    open={moreDialogOpen}
                    anchor={anchor}
                    handleClose={handleClose}
                    taskGroupId={props.taskGroupId}
                    task={props.task}
                />
            )}

            {taskId === props.task._id && (
                <TaskModal
                    boardId={props.board._id}
                    taskGroupId={props.taskGroupId}
                    task={props.task}
                />
            )}
        </>
    )
}

export default Task
