import { memo, useCallback, useState } from 'react'
import '../../../../../styles/Task.css'
import TaskPopover from './task/TaskPopover'
import useInputState from '../../../../../modules/hooks/useInputState.tsx'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import TaskModal from './TaskModal.tsx'
import { useEditTaskFieldMutation } from '../../../../../modules/services/boardSlice.ts'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QuickActionsToolbar from './QuickActionsToolbar'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import NewTaskForm from './NewTaskForm.tsx'
import TaskColumns from './task/TaskColumns.tsx'
import { Attribute, Label, FlatTask } from '../../../../../types/Board'
import { Member } from '../../../../../types/Workspace'

interface Props {
    hasPerms: (string) => boolean
    task: FlatTask
    attributes: Attribute[]
    boardId: string
    groupBy: string
    members: Member[]
    handleCollapse: (string) => void
    groupedTasks: Label[]
    taskGroupId: string
    index: number
}

function Task({
    hasPerms,
    task,
    attributes,
    boardId,
    groupBy,
    members,
    handleCollapse,
    groupedTasks,
    taskGroupId,
    index
}: Props) {
    const [anchor, setAnchor] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const { taskId } = useParams()
    const [moreDialogOpen, setMoreDialogOpen] = useState(false)
    const [editTaskField] = useEditTaskFieldMutation()
    const [batchSelect, setBatchSelect] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [newTaskOpen, setNewTaskOpen] = useState(false)
    const {
        attributes: sortableAttributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: task._id,
        disabled: !hasPerms('MANAGE:TASK') || (groupBy && groupBy !== 'none')
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const [taskEditing, setTaskEditing] = useState(false)
    const [taskName, changeTaskName] = useInputState(task.name)

    const openTaskModal = () => {
        if (!hasPerms('READ:PUBLIC')) return
        if (taskEditing) return
        navigate(`${location.pathname}/${task._id}`)
    }

    const handleClose = useCallback(() => {
        setAnchor(null)
        setMoreDialogOpen(false)
    }, [])

    const handleMoreClick = e => {
        if (!(hasPerms('MANAGE:TASK') || hasPerms('DELETE:TASK'))) return
        setAnchor(e.currentTarget)
        setMoreDialogOpen(!moreDialogOpen)
    }

    const handleCollapseClick = e => {
        e.preventDefault()
        e.stopPropagation()
        handleCollapse(task._id)
        setCollapsed(!collapsed)
    }

    const toggleTaskEdit = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        setTimeout(() => setTaskEditing(prev => !prev), 0)
    }, [])

    const handleTaskEdit = e => {
        e.preventDefault()
        setTaskEditing(false)
        if (task.name === taskName) return
        editTaskField({
            type: 'name',
            value: taskName,
            boardId,
            taskId: task._id
        })
    }

    return (
        <>
            <div
                className={`Task group outline-none cursor-pointer flex flex-row items-stretch justify-start relative border-b border-white ${
                    taskEditing ? 'editing' : ''
                }`}
                ref={setNodeRef}
                style={style}
            >
                {!taskEditing && (
                    <div
                        className={`!hidden absolute left-[-22px] h-full self-stretch w-[20px] ${
                            hasPerms('MANAGE:TASK') ? '' : '!cursor-auto '
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
                    {...listeners}
                    {...sortableAttributes}
                    onClick={openTaskModal}
                    className={`outline-none w-[200px] sm:min-w-[400px] flex grow shrink-0 basis-0 bg-white w-full flex flex-row self-stretch group-hover:bg-fafbfc bg-white z-10 justify-start sticky left-0 ${
                        task.level > 0 ? 'subtask' : ''
                    } ${index > 0 ? 'subtaskNotFirst' : ''} ${
                        task.children > 0 ? 'subtaskWithSubtasks' : ''
                    } ${hasPerms('MANAGE:TASK') ? '' : '!cursor-auto'}`}
                    style={{
                        // @ts-ignore
                        '--total-margin-left': task.level * 32 - 32 + 12 + 'px'
                    }}
                >
                    <div
                        onClick={handleCollapseClick}
                        className={`absolute text-[10px] w-[25px] text-[#b9bec7] hover:text-[#7c828d] p-[4px] h-full flex justify-center items-center ${
                            task.children > 0 ? 'cursor-pointer' : 'hidden'
                        }`}
                        style={{
                            marginLeft: task.level * 32 + 'px'
                        }}
                    >
                        <FontAwesomeIcon
                            icon={solid('caret-down')}
                            className={`transition-transform ${
                                collapsed ? '-rotate-90' : ''
                            } ${
                                task.children > 0 ? 'subtaskWithSubtasks' : ''
                            }`}
                        />
                    </div>
                    {taskEditing ? (
                        <form
                            onSubmit={handleTaskEdit}
                            onBlur={handleTaskEdit}
                            className="text-[14px] pl-[25px]"
                            style={{
                                marginLeft: task.level * 32 + 'px'
                            }}
                        >
                            <input
                                onKeyUp={e => {
                                    if (e.key === 'Escape')
                                        e.currentTarget.blur()
                                }}
                                value={taskName}
                                onChange={changeTaskName}
                                name="taskName"
                                className="bg-transparent"
                                autoFocus
                            />
                        </form>
                    ) : (
                        <div
                            className="block flex-row ml-[25px] mr-[5px]"
                            style={{
                                paddingLeft: task.level * 32 + 'px'
                            }}
                        >
                            <p className="taskName text-sm inline">
                                {task.name}
                            </p>
                            {hasPerms('MANAGE:TASK') && (
                                <QuickActionsToolbar
                                    level={task.level}
                                    taskGroupId={taskGroupId}
                                    groupedTasks={groupedTasks}
                                    boardId={boardId}
                                    taskId={task._id}
                                    handleTaskEdit={toggleTaskEdit}
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
                    <TaskColumns
                        attributes={attributes}
                        task={task}
                        members={members}
                        boardId={boardId}
                        hasPerms={hasPerms}
                        taskGroupId={taskGroupId}
                    />

                    <div
                        className="z-[9] flex items-center justify-center h-full leading-9 text-center w-[40px] bg-[#c4c4c4]"
                        onClick={handleMoreClick}
                    >
                        {(hasPerms('MANAGE:TASK') ||
                            hasPerms('DELETE:TASK')) && (
                            <FontAwesomeIcon icon={solid('ellipsis-h')} />
                        )}
                    </div>
                </div>
            </div>

            {!taskEditing && (
                <TaskPopover
                    boardId={boardId}
                    toggleTaskEdit={toggleTaskEdit}
                    open={moreDialogOpen}
                    anchor={anchor}
                    handleClose={handleClose}
                    taskGroupId={taskGroupId}
                    taskId={task._id}
                />
            )}

            {taskId === task._id && (
                <TaskModal
                    boardId={boardId}
                    task={task}
                    hasPerms={hasPerms}
                    members={members}
                />
            )}

            {newTaskOpen && (
                <NewTaskForm
                    boardId={boardId}
                    taskId={task._id}
                    setNewTaskOpen={setNewTaskOpen}
                    level={task.level}
                    taskGroupId={taskGroupId}
                />
            )}
        </>
    )
}

export default memo(Task)
