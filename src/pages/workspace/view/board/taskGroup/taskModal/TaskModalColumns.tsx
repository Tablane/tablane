import PersonColumn from '../task/taskColumns/PersonColumn.tsx'
import TextColumn from '../task/taskColumns/TextColumn.tsx'
import DropDownColumn from '../task/taskColumns/DropDownColumn.tsx'
import { Attribute, Task } from '../../../../../../types/Board'
import { Member } from '../../../../../../types/Workspace'
import { memo } from 'react'

interface Props {
    attributes: Attribute[]
    task: Task
    members: Member[]
    boardId: string
    hasPerms: (string) => boolean
}

export default memo(function TaskModalColumns({
    attributes,
    task,
    members,
    boardId,
    hasPerms
}: Props) {
    return (
        <>
            {attributes.map(attribute => (
                <div key={attribute._id} className="flex flex-row items-center">
                    <span className="text-xs text-[#6b6f76] px-4 w-[120px]">
                        {attribute.name}
                    </span>
                    {attribute.type === 'status' && (
                        <DropDownColumn
                            attribute={attribute}
                            boardId={boardId}
                            hasPerms={hasPerms}
                            task={task}
                        />
                    )}
                    {attribute.type === 'text' && (
                        <TextColumn
                            attribute={attribute}
                            boardId={boardId}
                            task={task}
                            hasPerms={hasPerms}
                        />
                    )}
                    {attribute.type === 'people' && (
                        <PersonColumn
                            attribute={attribute}
                            boardId={boardId}
                            hasPerms={hasPerms}
                            members={members}
                            task={task}
                        />
                    )}
                </div>
            ))}
        </>
    )
})
