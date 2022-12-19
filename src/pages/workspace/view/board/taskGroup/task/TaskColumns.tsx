import { Fragment, memo, useCallback, useState } from 'react'
import { Tooltip } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import TaskColumnPopover from './TaskColumnPopover'
import { useEditOptionsTaskMutation } from '../../../../../../modules/services/boardSlice'
import PersonColumnPopover from '../task/PersonColumnPopover'

function TaskColumns({
    attributes,
    task,
    members,
    boardId,
    hasPerms,
    taskGroupId
}) {
    const [anchor, setAnchor] = useState(null)
    const [columnDialogOpen, setColumnDialogOpen] = useState(false)
    const [activeOption, setActiveOption] = useState('')
    const [editOptionsTask] = useEditOptionsTaskMutation()

    const handleClick = (e, key) => {
        if (!hasPerms('MANAGE:TASK')) return
        setAnchor(e.currentTarget)
        setActiveOption(key._id)
        setColumnDialogOpen(!columnDialogOpen)
    }

    const handleClose = useCallback(() => {
        setAnchor(null)
        setColumnDialogOpen(false)
    }, [])

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

    const getStatusLabel = attribute => {
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

    const getTextLabel = attribute => {
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

    const getPersonLabel = attribute => {
        let taskOption = task.options.find(x => x.column === attribute._id)

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
                        onClick={e => handleClick(e, attribute)}
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
                                        {person.username
                                            .charAt(0)
                                            .toUpperCase()}
                                        {person.username
                                            .charAt(1)
                                            .toUpperCase()}
                                    </div>
                                </Tooltip>
                            )
                        })}
                    </div>
                ) : (
                    <div
                        className="people text-[14px] border-white border-solid border-r flex items-center justify-center h-9 leading-9 text-center w-[120px]"
                        onClick={e => handleClick(e, attribute)}
                    >
                        <FontAwesomeIcon icon={regular('circle-user')} />
                    </div>
                )}
                {attribute._id.toString() === activeOption && (
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

    return (
        <>
            {attributes.map(attribute => {
                if (attribute.type === 'status')
                    return getStatusLabel(attribute)
                if (attribute.type === 'text') return getTextLabel(attribute)
                if (attribute.type === 'people') {
                    return getPersonLabel(attribute)
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
