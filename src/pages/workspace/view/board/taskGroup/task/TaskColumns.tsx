import { memo } from 'react'
import PersonColumn from './taskColumns/PersonColumn.tsx'
import TextColumn from './taskColumns/TextColumn.tsx'
import DropDownColumn from './taskColumns/DropDownColumn.tsx'

type TaskColumns = {
    attributes: any
    task: any
    members: any
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
}: TaskColumns) {
    return (
        <>
            {attributes.map(attribute => {
                if (attribute.type === 'status')
                    return (
                        <DropDownColumn
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
                            attribute={attribute}
                            boardId={boardId}
                            hasPerms={hasPerms}
                            task={task}
                        />
                    )
                if (attribute.type === 'people') {
                    return (
                        <PersonColumn
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
