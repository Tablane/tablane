import { ObjectId } from '../../../../../utils'
import useInputState from '../../../../../modules/hooks/useInputState'
import { useFetchUserQuery } from '../../../../../modules/services/userSlice'
import { useAddTaskMutation } from '../../../../../modules/services/boardSlice'

function NewTaskForm({ board, taskGroupId }) {
    const { data: user } = useFetchUserQuery()
    const [addTask] = useAddTaskMutation()
    const [newTaskName, changeNewTaskName, resetNewTaskName] = useInputState('')

    const handleAddTask = async e => {
        e.preventDefault()
        resetNewTaskName()
        addTask({
            author: user.username,
            boardId: board._id,
            taskGroupId: taskGroupId,
            newTaskName,
            _id: ObjectId()
        })
    }

    return (
        <form
            onSubmit={handleAddTask}
            className="ml-9 sticky left-0 new-task-form"
        >
            <div className="new-task w-full justify-between">
                <input
                    type="text"
                    placeholder="+ New Task"
                    value={newTaskName}
                    name="newTask"
                    className="sticky left-0 w-[calc(100vw_-_380px)]"
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
