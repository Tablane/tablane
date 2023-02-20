import { useEditTaskFieldMutation } from '../../../../../../../modules/services/boardSlice.ts'
import { Attribute, Task } from '../../../../../../../types/Board'
import useInputState from '../../../../../../../modules/hooks/useInputState.tsx'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

type Props = {
    attribute: Attribute
    task: Task
    boardId: string
    hasPerms: (string) => boolean
}

export default function TextColumn({
    task,
    attribute,
    boardId,
    hasPerms
}: Props) {
    const params = useParams()
    const [editTaskField] = useEditTaskFieldMutation()

    const handleTextEdit = async e => {
        if (
            task.options.find(option => option.column === e.target.name)
                ?.value === e.target.value
        )
            return

        editTaskField({
            column: e.target.name,
            viewShortId: params.view,
            value: e.target.value,
            type: 'text',
            boardId,
            taskId: task._id
        })
    }

    let taskOption = task.options.find(x => x.column === attribute._id)
    if (!taskOption) taskOption = { _id: '', column: '', value: '' }

    const [value, handleChange, , setValue] = useInputState(taskOption.value)

    useEffect(() => {
        setValue(taskOption.value)
    }, [taskOption.value])

    return (
        <div
            className="text-[14px] h-full border-white border-solid border-r flex items-center justify-center leading-9 text-center w-[120px]"
            style={{ backgroundColor: 'transparent' }}
            key={attribute._id}
        >
            <input
                readOnly={!hasPerms('MANAGE:TASK')}
                type="text"
                className="w-full text-center outline-none"
                onKeyUp={e => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                }}
                name={attribute._id}
                onBlur={handleTextEdit}
                onChange={handleChange}
                value={value}
            />
        </div>
    )
}
