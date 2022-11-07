import { useState } from 'react'
import '../../../../styles/TaskGroup.css'
import Task from '../board/taskGroup/Task'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import AttributePopover from '../board/taskGroup/AttributePopover'
import AddAttributePopover from '../board/taskGroup/AddAttributePopover'
import useInputState from '../../../../modules/hooks/useInputState'
import { ObjectId } from '../../../../utils'
import { useFetchUserQuery } from '../../../../modules/services/userSlice'
import { useAddTaskMutation } from '../../../../modules/services/boardSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import ExpandCircleIcon from '../../../../styles/assets/ExpandCircleIcon'
import PlusIcon from '../../../../styles/assets/PlusIcon'

function TaskGroup(props) {
    const { data: user } = useFetchUserQuery()
    const [addTask] = useAddTaskMutation()
    const [collapsed, setCollapsed] = useState(false)

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
        <div className="task my-7 font-normal">
            <div className="title ml-4">
                <div className="sticky left-[-20px] bg-backgroundGrey flex-grow flex-shrink-0 basis-[400px] flex justify-start items-center">
                    <ExpandCircleIcon
                        className={`h-4 w-4 text-bcc0c7 mr-1 transition-transform cursor-pointer ${
                            !collapsed ? '-rotate-90' : ''
                        }`}
                        style={{ fill: props.color }}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <div
                        className="taskGroup-title h-6"
                        style={{ backgroundColor: props.color }}
                    >
                        <p style={{ color: !props.name && '' }}>
                            {props.name || 'Empty'}
                        </p>
                    </div>
                    <p className="task-amount font-medium text-xs text-adb3bd">
                        {props.tasks.length} TASKS
                    </p>
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
                                                className="attribute font-medium"
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                            >
                                                <FontAwesomeIcon
                                                    icon={solid('caret-down')}
                                                />
                                                <p className="text-xs text-adb3bd">
                                                    {x.name}
                                                </p>
                                                <FontAwesomeIcon
                                                    icon={solid('caret-down')}
                                                    className="cursor-pointer"
                                                    onClick={e =>
                                                        handleAttributePopover(
                                                            e,
                                                            x
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                            <div className="attribute">
                                <p
                                    onClick={handleAddNewAttribute}
                                    className="cursor-pointer"
                                >
                                    <PlusIcon className="h-4 text-adb3bd" />
                                </p>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
            <Droppable droppableId={props.taskGroupId} type="task">
                {provided => (
                    <div
                        className="tasks ml-4"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {props.tasks.map((task, i) => {
                            return (
                                <Task
                                    groupedTasks={props.groupedTasks}
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
            <form
                onSubmit={handleAddTask}
                className="ml-9 sticky left-0 new-task-form"
            >
                <div className="new-task w-full">
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
