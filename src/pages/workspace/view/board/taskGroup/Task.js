import { Fragment, useState } from 'react'
import '../../../../../styles/Task.css'
import TaskColumnPopover from './task/TaskColumnPopover'
import { Draggable } from '@hello-pangea/dnd'
import TaskPopover from './task/TaskPopover'
import useInputState from '../../../../../modules/hooks/useInputState'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import TaskModal from './TaskModal'
import PersonColumnPopover from './task/PersonColumnPopover'
import { Tooltip } from '@mui/material'
import { useFetchWorkspaceQuery } from '../../../../../modules/services/workspaceSlice'
import {
    useEditOptionsTaskMutation,
    useEditTaskFieldMutation
} from '../../../../../modules/services/boardSlice'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QuickActionsToolbar from './QuickActionsToolbar'
import NewTaskForm from './NewTaskForm'

function Task(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const { taskId, workspace: workspaceId } = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(workspaceId)
    const [anchor, setAnchor] = useState(null)
    const [activeOption, setActiveOption] = useState('')
    const [columnDialogOpen, setColumnDialogOpen] = useState(false)
    const [moreDialogOpen, setMoreDialogOpen] = useState(false)
    const [editOptionsTask] = useEditOptionsTaskMutation()
    const [editTaskField] = useEditTaskFieldMutation()
    const [batchSelect, setBatchSelect] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [newTaskOpen, setNewTaskOpen] = useState(false)
    const { hasPerms } = props

    const [taskEditing, setTaskEditing] = useState(false)
    const [taskName, changeTaskName] = useInputState(props.task.name)

    const openTaskModal = () => {
        if (!hasPerms('READ:PUBLIC')) return
        if (taskEditing) return
        navigate(`${location.pathname}/${props.task._id}`)
    }

    const handleClose = () => {
        setAnchor(null)
        setMoreDialogOpen(false)
        setColumnDialogOpen(false)
    }

    const handleClick = (e, key) => {
        if (!hasPerms('MANAGE:TASK')) return
        setAnchor(e.currentTarget)
        setActiveOption(key._id)
        setColumnDialogOpen(!columnDialogOpen)
    }

    const handleMoreClick = e => {
        if (!(hasPerms('MANAGE:TASK') || hasPerms('DELETE:TASK'))) return
        setAnchor(e.currentTarget)
        setMoreDialogOpen(!moreDialogOpen)
    }

    const handleCollapse = e => {
        e.preventDefault()
        e.stopPropagation()
        setCollapsed(!collapsed)
    }

    const handleTextEdit = async e => {
        const { task } = props
        if (
            task.options.find(option => option.column === e.target.name)
                ?.value === e.target.value
        )
            return

        editOptionsTask({
            column: e.target.name,
            value: e.target.value,
            type: 'text',
            boardId: props.board._id,
            taskId: task._id
        })
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
                        boardId={props.board._id}
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
                        <FontAwesomeIcon icon={regular('circle-user')} />
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
        editTaskField({
            type: 'name',
            value: taskName,
            boardId: props.board._id,
            taskId: task._id
        })
    }

    return (
        <>
            <Draggable
                draggableId={props.task._id}
                isDragDisabled={!hasPerms('MANAGE:TASK')}
                index={props.index}
                type="task"
            >
                {provided => (
                    <div
                        className={`Task border-b border-white ${
                            taskEditing ? 'editing' : ''
                        }`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                    >
                        {!taskEditing && (
                            <div
                                className={`absolute left-[-22px] h-full self-stretch w-[20px] ${
                                    hasPerms('MANAGE:TASK')
                                        ? ''
                                        : '!cursor-auto '
                                }`}
                                onClick={() => setBatchSelect(!batchSelect)}
                            >
                                <input
                                    type="checkbox"
                                    checked={batchSelect}
                                    readOnly
                                    className={`opacity-0 batch-select-checkbox relative mr-1 w-4 h-4 rounded-full appearance-none bg-white border-solid border cursor-pointer align-middle ${
                                        hasPerms('MANAGE:TASK') ? '' : 'hidden'
                                    }`}
                                />
                            </div>
                        )}
                        <div
                            onClick={openTaskModal}
                            className={`w-[200px] sm:min-w-[400px] flex grow shrink-0 basis-0 bg-white w-full flex flex-row self-stretch hover:bg-fafbfc justify-start sticky left-0 ${
                                props.task.level > 0 ? 'subtask' : ''
                            } ${props.index > 0 ? 'subtaskNotFirst' : ''} ${
                                props.task.subtasks.length > 0
                                    ? 'subtaskWithSubtasks'
                                    : ''
                            } ${taskEditing ? 'ml-[20px]' : ''} ${
                                hasPerms('MANAGE:TASK') ? '' : '!cursor-auto'
                            }`}
                            style={{
                                '--total-margin-left':
                                    props.task.level * 32 - 32 + 12 + 'px'
                            }}
                        >
                            <div
                                onClick={handleCollapse}
                                className={`absolute text-[10px] w-[25px] text-[#b9bec7] hover:text-[#7c828d] p-[4px] h-full flex justify-center items-center ${
                                    props.task.subtasks.length > 0
                                        ? 'cursor-pointer'
                                        : 'hidden'
                                }`}
                                style={{
                                    marginLeft: props.task.level * 32 + 'px'
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={solid('caret-down')}
                                    className={`transition-transform ${
                                        collapsed ? '-rotate-90' : ''
                                    } ${
                                        props.task.subtasks.length > 0
                                            ? 'subtaskWithSubtasks'
                                            : ''
                                    }`}
                                />
                            </div>
                            {taskEditing ? (
                                <form
                                    onSubmit={handleTaskEdit}
                                    onBlur={handleTaskEdit}
                                    className="text-[14px] border-t border-red-600"
                                    style={{
                                        paddingLeft:
                                            props.task.level * 32 + 25 + 'px'
                                    }}
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
                                <div
                                    className="flex flex-row"
                                    style={{
                                        paddingLeft:
                                            props.task.level * 32 + 'px'
                                    }}
                                >
                                    <p className="taskName text-sm">
                                        {props.task.name}
                                    </p>
                                    {hasPerms('MANAGE:TASK') && (
                                        <QuickActionsToolbar
                                            level={props.task.level}
                                            taskGroupId={props.taskGroupId}
                                            groupedTasks={props.groupedTasks}
                                            board={props.board}
                                            task={props.task}
                                            handleTaskEdit={handleTaskEdit}
                                            setNewTaskOpen={setNewTaskOpen}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <div
                            onClick={e => e.stopPropagation()}
                            className={`taskAttr ml-auto ${
                                hasPerms('MANAGE:COLUMN')
                                    ? 'cursor-pointer'
                                    : 'cursor-auto'
                            }`}
                        >
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
                                {(hasPerms('MANAGE:TASK') ||
                                    hasPerms('DELETE:TASK')) && (
                                    <FontAwesomeIcon
                                        icon={solid('ellipsis-h')}
                                    />
                                )}
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
            <div className={`${collapsed ? 'hidden' : ''}`}>
                {props.task?.subtasks.map((subtask, i) => {
                    return (
                        <Task
                            hasPerms={hasPerms}
                            groupedTasks={props.groupedTasks}
                            board={props.board}
                            key={subtask._id}
                            task={subtask}
                            index={i}
                            taskGroupId={props.taskGroupId}
                        />
                    )
                })}
                {newTaskOpen && (
                    <NewTaskForm
                        board={props.board}
                        taskId={props.task._id}
                        setNewTaskOpen={setNewTaskOpen}
                        level={props.task.level}
                    />
                )}
            </div>
        </>
    )
}

export default Task
