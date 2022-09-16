import { useState } from 'react'
import '../../../styles/TaskGroup.css'
import Task from './taskGroup/Task'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import AttributePopover from './taskGroup/AttributePopover'
import AddAttributePopover from './taskGroup/AddAttributePopover'
import useInputState from '../../../modules/hooks/useInputState'
import { ObjectId } from '../../../utils'
import { useFetchUserQuery } from '../../../modules/state/services/userSlice'
import { useAddTaskMutation } from '../../../modules/state/services/boardSlice'

function TaskGroup(props) {
    const { data: user } = useFetchUserQuery()
    const [addTask] = useAddTaskMutation()

    // new task input
    const [newTaskName, changeNewTaskName, resetNewTaskName] = useInputState('')

    // attribute popover
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [popoverId, setPopoverId] = useState('')

    // add new attribute popover
    const [newAttributeOpen, setNewAttributeOpen] = useState(false)

    const handleAddNewAttribute = (e = false) => {
        setNewAttributeOpen(e ? e.target.parentNode.parentNode : false)
    }

    const handleAddTask = async e => {
        e.preventDefault()
        resetNewTaskName()
        addTask({
            author: user.username,
            boardId: props.board._id,
            taskGroupId: props.taskGroupId,
            newTaskName,
            _id: ObjectId()
        })
    }

    const handleAttributePopover = (e, id = null) => {
        setPopoverId(id ? id : popoverId)
        setPopoverOpen(e ? e.target.parentNode : null)
    }

    return (
        <div className="task">
            <div className="title">
                <div>
                    <div
                        className="taskGroup-title"
                        style={{ backgroundColor: props.color }}
                    >
                        <p style={{ color: !props.name && '' }}>
                            {props.name || 'Empty'}
                        </p>
                    </div>
                    <p className="task-amount">{props.tasks.length} TASKS</p>
                </div>
                <Droppable
                    droppableId={props.taskGroupId + 'attribute'}
                    direction="horizontal"
                    type={`attribute ${props.taskGroupId}`}
                >
                    {provided => (
                        <div
                            className="attributes"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {props.board.attributes.map((x, i) => {
                                return (
                                    <Draggable
                                        draggableId={props.taskGroupId + x._id}
                                        index={i}
                                        key={props.taskGroupId + x._id}
                                    >
                                        {provided => (
                                            <div
                                                className="attribute"
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                            >
                                                <i className="fas fa-caret-down">
                                                    {' '}
                                                </i>
                                                <p>{x.name}</p>
                                                <i
                                                    className="fas fa-caret-down"
                                                    onClick={e =>
                                                        handleAttributePopover(
                                                            e,
                                                            x
                                                        )
                                                    }
                                                >
                                                    {' '}
                                                </i>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                            <div className="attribute">
                                <p>
                                    <i
                                        onClick={handleAddNewAttribute}
                                        className="fas fa-plus-circle"
                                    >
                                        {' '}
                                    </i>
                                </p>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
            <Droppable droppableId={props.taskGroupId} type="task">
                {provided => (
                    <div
                        className="tasks"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {props.tasks.map((task, i) => {
                            return (
                                <Task
                                    board={props.board}
                                    key={task._id}
                                    task={task}
                                    index={i}
                                    taskGroupId={props.taskGroupId}
                                />
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
                        onChange={changeNewTaskName}
                    />
                    {newTaskName ? <button>SAVE</button> : null}
                </div>
            </form>

            <AttributePopover
                boardId={props.board._id}
                open={popoverOpen}
                close={handleAttributePopover}
                attr={popoverId}
            />
            <AddAttributePopover
                boardId={props.board._id}
                anchor={newAttributeOpen}
                close={handleAddNewAttribute}
            />
        </div>
    )
}

export default TaskGroup
