import { ObjectId } from '../../../../../utils'
import useInputState from '../../../../../modules/hooks/useInputState.tsx'
import { useFetchUserQuery } from '../../../../../modules/services/userSlice'
import {
    useAddSubtaskMutation,
    useAddTaskMutation
} from '../../../../../modules/services/boardSlice.ts'
import { useRef, useState } from 'react'
import { useClickAway } from 'react-use'

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
    const [multipleTasks, setMultipleTasks] = useState<string[]>([])
    const [newTaskName, changeNewTaskName, resetNewTaskName] = useInputState('')
    const ref = useRef(null)
    useClickAway(ref, () => setMultipleTasks([]))

    const handleAddTask = async e => {
        e.preventDefault()
        if (newTaskName === '') return
        resetNewTaskName()
        if (level >= 0) return handleSubTask()
        addTask({
            author: user.username,
            level: level + 1,
            boardId,
            taskGroupId,
            newTaskName,
            _id: ObjectId()
        })
    }

    const handlePaste = e => {
        const value = e.clipboardData.getData('text')
        const values = value.split('\r\n')

        if (values.length > 1) {
            setMultipleTasks([
                ...values.filter(name => name !== '').splice(0, 100)
            ])

            resetNewTaskName()
        }

        console.log({
            value,
            hasBreak: value.split('\r\n').length > 1
        })
    }

    const handleSubTask = () => {
        addSubtask({
            boardId,
            newTaskName,
            taskId
        })
    }

    const handleMultitaskCreation = () => {
        multipleTasks.map(taskName => {
            if (level >= 0) return handleSubTask()
            addTask({
                author: user.username,
                level: level + 1,
                boardId,
                taskGroupId,
                newTaskName: taskName,
                _id: ObjectId()
            })
        })
        resetNewTaskName()
        setMultipleTasks([])
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
            className={`sticky z-[51] left-0 new-task-form bg-white rounded-b-sm ${
                level === -1 ? 'ml-9' : ''
            }`}
        >
            {multipleTasks.length > 1 && (
                <div
                    ref={ref}
                    className="bottom-[40px] absolute rounded bg-[#4169E1] text-white px-4 py-3 text-center text-sm ml-[calc(50%_-_80px)]"
                >
                    <p className="pb-2">Multiple lines detected</p>
                    <p
                        onClick={handleMultitaskCreation}
                        className="transition-all border rounded hover:bg-[#234FD7] hover:border-[#234FD7] cursor-pointer"
                    >
                        Create {multipleTasks.length} tasks
                    </p>
                    <div className="flex justify-center">
                        <div className="w-0 border-solid absolute bottom-[-8px] border-t-[#4169E1] border-t-8 border-x-transparent border-x-8 border-b-0"></div>
                    </div>
                </div>
            )}
            <label className="cursor-text new-task w-full justify-between border-white border-2 border-t-0 rounded-b-sm">
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
                    onPaste={handlePaste}
                />
                <button
                    className={`sticky right-[25px] ${
                        newTaskName ? '' : 'hidden'
                    }`}
                >
                    SAVE
                </button>
            </label>
        </form>
    )
}

export default NewTaskForm
