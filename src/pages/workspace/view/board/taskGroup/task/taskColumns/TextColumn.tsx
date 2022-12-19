import { useEditOptionsTaskMutation } from '../../../../../../../modules/services/boardSlice'

type TextColumnProps = {
    attribute
    task
    hasPerms: (string) => boolean
    boardId: string
}

export default function TextColumn({
    task,
    attribute,
    hasPerms,
    boardId
}: TextColumnProps) {
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
    if (!taskOption) taskOption = { value: '' }

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
