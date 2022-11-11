import { ObjectId } from '../../../../../utils'
import useInputState from '../../../../../modules/hooks/useInputState'
import { useFetchUserQuery } from '../../../../../modules/services/userSlice'
import {
    useAddSubtaskMutation,
    useAddTaskMutation
} from '../../../../../modules/services/boardSlice'

function NewTaskForm({
    board,
    taskGroupId,
    level = -1,
    setNewTaskOpen,
    taskId
}) {
    const { data: user } = useFetchUserQuery()
    const [addTask] = useAddTaskMutation()
    const [addSubtask] = useAddSubtaskMutation()
    const [newTaskName, changeNewTaskName, resetNewTaskName] = useInputState('')

    const handleAddTask = async e => {
        e.preventDefault()
        resetNewTaskName()
        if (level >= 0) return handleSubTask()
        addTask({
            author: user.username,
            boardId: board._id,
            taskGroupId: taskGroupId,
            newTaskName,
            _id: ObjectId()
        })
    }

    const handleSubTask = () => {
        addSubtask({
            boardId: board._id,
            newTaskName,
            taskId
        })
    }

    const handleKeyUp = e => {
        if (['Escape'].includes(e.key)) handleBlur()
    }

    const handleBlur = () => {
        if (level >= 0) setNewTaskOpen(false)
    }

    return (
        <form
            onSubmit={handleAddTask}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            style={{
                marginLeft: level === -1 ? '36px' : '20px',
                paddingLeft: level * 32 + 'px'
            }}
            className={`ml-9 sticky left-0 new-task-form bg-white ${level}`}
        >
            <div className="new-task w-full justify-between">
                <input
                    autoFocus={level !== -1}
                    type="text"
                    placeholder="+ New Task"
                    value={newTaskName}
                    name="newTask"
                    className="sticky left-0 w-full"
                    onChange={changeNewTaskName}
                />
                <button
                    className={`opacity-0 sticky right-[25px] ${
                        newTaskName ? 'opacity-100' : ''
                    }`}
                >
                    SAVE
                </button>
            </div>
        </form>
    )
}

export default NewTaskForm
