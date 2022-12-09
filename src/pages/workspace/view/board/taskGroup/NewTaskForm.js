import { ObjectId } from '../../../../../utils'
import useInputState from '../../../../../modules/hooks/useInputState'
import { useFetchUserQuery } from '../../../../../modules/services/userSlice'
import {
    useAddSubtaskMutation,
    useAddTaskMutation
} from '../../../../../modules/services/boardSlice'

function NewTaskForm({
    boardId,
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
        if (newTaskName === '') return
        resetNewTaskName()
        if (level >= 0) return handleSubTask()
        addTask({
            author: user.username,
            level: level + 1,
            boardId,
            taskGroupId: taskGroupId,
            newTaskName,
            _id: ObjectId()
        })
    }

    const handleSubTask = () => {
        addSubtask({
            boardId,
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
            className={`sticky left-0 new-task-form bg-white rounded-b-sm ${
                level === -1 ? 'ml-9' : ''
            }`}
        >
            <div className="new-task w-full justify-between border-white border-2 border-t-0 rounded-b-sm">
                <input
                    autoFocus={level !== -1}
                    type="text"
                    placeholder="+ New Task"
                    value={newTaskName}
                    name="newTask"
                    style={{
                        paddingLeft:
                            level !== -1 ? (level + 1) * 32 + 25 + 'px' : '20px'
                    }}
                    className={`sticky left-0`}
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
