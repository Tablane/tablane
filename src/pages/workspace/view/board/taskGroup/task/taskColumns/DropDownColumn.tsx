import TaskColumnPopover from '../TaskColumnPopover'
import { Attribute, Task } from '../../../../../../../types/Board'

type DropDownColumnProps = {
    attribute: Attribute
    task: Task
    boardId: string
    hasPerms: (string) => boolean
    taskGroupId: string
}

export default function DropDownColumn({
    attribute,
    task,
    boardId,
    hasPerms,
    taskGroupId
}) {
    let taskOption = task.options.find(x => x.column === attribute._id)
    let label

    if (taskOption) {
        label = attribute.labels.find(x => x._id === taskOption.value)
    } else label = { color: 'rgb(196,196,196)', name: '' }

    if (!label) label = { color: 'rgb(196,196,196)', name: '' }

    return (
        <TaskColumnPopover
            key={attribute._id}
            hasPerms={hasPerms}
            boardId={boardId}
            label={label}
            attribute={attribute}
            task={task}
            taskGroupId={taskGroupId}
        />
    )
}
