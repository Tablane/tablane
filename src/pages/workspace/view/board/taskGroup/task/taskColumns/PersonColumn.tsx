import { Fragment, useCallback, useState } from 'react'
import { Tooltip } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import PersonColumnPopover from '../PersonColumnPopover'
import { Attribute, Task } from '../../../../../../../types/Board'
import { Member } from '../../../../../../../types/Workspace'

type Props = {
    attribute: Attribute
    members: Member[]
    task: Task
    hasPerms: (string) => boolean
    boardId: string
}

export default function PersonColumn({
    attribute,
    members,
    task,
    hasPerms,
    boardId
}: Props) {
    const [anchor, setAnchor] = useState(null)
    let taskOption = task.options.find(x => x.column === attribute._id)

    const handleClick = e => {
        if (!hasPerms('MANAGE:TASK')) return
        setAnchor(e.currentTarget)
    }

    const handleClose = useCallback(() => {
        setAnchor(null)
    }, [])

    const people = []
    if (taskOption) {
        taskOption.value.map(userId => {
            const person = members.find(({ user }) => user._id === userId)
            if (person) people.push(person.user)
        })
    }

    return (
        <Fragment key={attribute._id}>
            {people.length > 0 ? (
                <div
                    className="people text-[14px] border-white border-solid border-r flex -space-x-4 items-center justify-center h-9 leading-9 text-center w-[120px]"
                    onClick={handleClick}
                >
                    {people.map((person, i) => {
                        return (
                            <Tooltip
                                disableInteractive
                                title={person.username}
                                key={person._id}
                                arrow
                            >
                                <div
                                    style={{ zIndex: people.length - i }}
                                    className="person text-[10px] min-w-[32px] h-[32px] rounded-full border-2 border-white dark:border-gray-800 flex justify-center items-center text-white hover:!z-50"
                                >
                                    {person.username.charAt(0).toUpperCase()}
                                    {person.username.charAt(1).toUpperCase()}
                                </div>
                            </Tooltip>
                        )
                    })}
                </div>
            ) : (
                <div
                    className="people text-[14px] border-white border-solid border-r flex items-center justify-center h-9 leading-9 text-center w-[120px]"
                    onClick={handleClick}
                >
                    <FontAwesomeIcon icon={regular('circle-user')} />
                </div>
            )}
            {hasPerms('MANAGE:TASK') && (
                <PersonColumnPopover
                    boardId={boardId}
                    attribute={attribute}
                    people={people}
                    taskOption={taskOption}
                    anchor={anchor}
                    task={task}
                    handleClose={handleClose}
                />
            )}
        </Fragment>
    )
}
