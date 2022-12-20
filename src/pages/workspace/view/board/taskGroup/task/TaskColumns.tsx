import { memo } from 'react'
import PersonColumn from './taskColumns/PersonColumn.tsx'
import TextColumn from './taskColumns/TextColumn.tsx'
import DropDownColumn from './taskColumns/DropDownColumn.tsx'
import { Attribute, Task } from '../../../../../../types/Board'
import { Member } from '../../../../../../types/Workspace'

interface Props {
    attributes: Attribute[]
    task: Task
    members: Member[]
    boardId: string
    hasPerms: (string) => boolean
    taskGroupId: string
}

function TaskColumns({
    attributes,
    task,
    members,
    boardId,
    hasPerms,
    taskGroupId
}: Props) {
    return (
        <>
            {attributes.map(attribute => {
                if (attribute.type === 'status')
                    return (
                        <DropDownColumn
                            key={attribute._id}
                            attribute={attribute}
                            boardId={boardId}
                            hasPerms={hasPerms}
                            task={task}
                            taskGroupId={taskGroupId}
                        />
                    )
                if (attribute.type === 'text')
                    return (
                        <TextColumn
                            key={attribute._id}
                            attribute={attribute}
                            boardId={boardId}
                            task={task}
                            hasPerms={hasPerms}
                        />
                    )
                if (attribute.type === 'people') {
                    return (
                        <PersonColumn
                            key={attribute._id}
                            attribute={attribute}
                            boardId={boardId}
                            hasPerms={hasPerms}
                            members={members}
                            task={task}
                        />
                    )
                }

                return (
                    <div
                        style={{ backgroundColor: 'crimson' }}
                        key={Math.random()}
                    >
                        ERROR
                    </div>
                )
            })}
        </>
    )
}

export default memo(TaskColumns)
