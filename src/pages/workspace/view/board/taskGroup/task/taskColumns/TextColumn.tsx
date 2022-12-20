import { useEditOptionsTaskMutation } from '../../../../../../../modules/services/boardSlice'
import { Attribute, Task } from '../../../../../../../types/Board'

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
    const [editOptionsTask] = useEditOptionsTaskMutation()

    const handleTextEdit = async e => {
        if (
            task.options.find(option => option.column === e.target.name)
                ?.value === e.target.value
        )
            return

        editOptionsTask({
            column: e.target.name,
            value: e.target.value,
            type: 'text',
            boardId,
            taskId: task._id
        })
    }

    let taskOption = task.options.find(x => x.column === attribute._id)
    if (!taskOption) taskOption = { _id: '', column: '', value: '' }

    return (
        <div
            className="text-[14px] border-white border-solid border-r flex items-center justify-center h-9 leading-9 text-center w-[120px]"
            style={{ backgroundColor: 'transparent' }}
            key={attribute._id}
        >
            <input
                readOnly={!hasPerms('MANAGE:TASK')}
                type="text"
                name={attribute._id}
                onBlur={handleTextEdit}
                defaultValue={taskOption.value}
            />
        </div>
    )
}
