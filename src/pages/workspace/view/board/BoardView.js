import {
    useSortAttributeMutation,
    useSortTaskMutation
} from '../../../../modules/services/boardSlice.ts'
import { forwardRef, memo, useMemo, useState } from 'react'
import TaskGroup from './TaskGroup.tsx'
import _ from 'lodash'
import { DragDropContext } from '@hello-pangea/dnd'
import ExpandCircleIcon from '../../../../styles/assets/ExpandCircleIcon'
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    TouchSensor,
    MouseSensor
} from '@dnd-kit/core'
import { buildTree, flatten } from '../../../../utils/taskUtils.ts'
import Fuse from 'fuse.js'
import { useAtom } from 'jotai'
import { searchAtom } from '../../../../utils/atoms.ts'

function BoardView({ board, members, hasPerms }, viewContainerRef) {
    const [sortAttribute] = useSortAttributeMutation()
    const [sortTask] = useSortTaskMutation()
    const [groupedTasks, setGroupedTasks] = useState([])
    const [collapsed, setCollapsed] = useState(true)
    const [search] = useAtom(searchAtom)

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 }
        }),
        useSensor(MouseSensor, {
            activationConstraint: { distance: 15 }
        }),
        useSensor(MouseSensor, {
            activationConstraint: { distance: 15 }
        })
    )

    const groupTasks = useMemo(() => {
        if (!board) return
        if (!board.groupBy || board.groupBy === 'none') {
            const fuse = new Fuse(board.tasks, {
                keys: ['name'],
                shouldSort: false
            })
            const tasks =
                search === ''
                    ? board.tasks
                    : fuse.search(search).map(x => x.item)

            return (
                <TaskGroup
                    ref={viewContainerRef}
                    hasPerms={hasPerms}
                    boardId={board._id}
                    groupBy={board?.groupBy}
                    attributes={board.attributes}
                    members={members}
                    color={'rgb(196, 196, 196)'}
                    name=""
                    taskGroupId={'empty'}
                    tasks={tasks}
                />
            )
        }

        const labels = _.cloneDeep(
            board.attributes.find(attribute => attribute._id === board.groupBy)
                .labels
        )

        labels.push({
            name: '',
            color: 'rgb(196, 196, 196)',
            _id: 'empty'
        })
        labels.map(label => (label.tasks = []))

        buildTree(board.tasks).map(task => {
            const value = task.options.find(
                option => option.column === board.groupBy
            )?.value
            const label = labels.find(label => label._id === value)
            if (value && label) label.tasks.push(task)
            else labels.find(label => label._id === 'empty').tasks.push(task)
        })

        labels.map(x => (x.tasks = flatten(x.tasks)))
        setGroupedTasks(labels)

        return labels.map(label => (
            <TaskGroup
                ref={viewContainerRef}
                hasPerms={hasPerms}
                groupedTasks={labels}
                boardId={board._id}
                groupBy={board?.groupBy}
                attributes={board.attributes}
                members={members}
                color={label.color}
                key={label._id}
                name={label.name}
                taskGroupId={label._id}
                tasks={label.tasks}
            />
        ))
    }, [board, search])

    const onDragStart = () => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'pointer'
    }

    const handleDragEnd = async result => {
        const [body] = document.getElementsByTagName('body')
        body.style.cursor = 'auto'
        if (
            result.destination === null ||
            (result.destination.index === result.source.index &&
                result.destination.droppableId === result.source.droppableId)
        )
            return
        if (result.type === 'task') {
            let destinationIndex = result.destination.index
            const sourceIndex = board.tasks.findIndex(
                x => x._id.toString() === result.draggableId
            )
            if (!(!board.groupBy || board.groupBy === 'none')) {
                const destinationTask = groupedTasks.find(
                    group => group._id === result.destination.droppableId
                ).tasks[result.destination.index]

                if (
                    result.source.droppableId === result.destination.droppableId
                ) {
                    destinationIndex = board.tasks.findIndex(
                        task => task._id === destinationTask?._id
                    )
                } else {
                    const splicedTasks = _.cloneDeep(board.tasks)
                    splicedTasks.splice(sourceIndex, 1)
                    destinationIndex = splicedTasks.findIndex(
                        task => task._id === destinationTask?._id
                    )
                }
            }
            sortTask({
                result,
                destinationIndex,
                sourceIndex,
                boardId: board._id
            })
        } else if (/^attribute /gm.test(result.type)) {
            sortAttribute({ result, boardId: board._id })
        }
    }

    return (
        <div className="pb-0 pt-2 pl-8 min-w-fit">
            {board && (
                <DragDropContext
                    onDragEnd={handleDragEnd}
                    onDragStart={onDragStart}
                >
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                    >
                        <div className="border border-borderGrey rounded-md font-medium mr-6 mb-9">
                            <div className="px-4 h-9 flex justify-content items-center">
                                <div
                                    className="left-0 sticky flex justify-content items-center px-1 rounded cursor-pointer hover:bg-bcc0c74d"
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    <ExpandCircleIcon
                                        className={`h-4 w-4 text-bcc0c7 mr-1 transition-transform fill-bcc0c7 ${
                                            !collapsed ? '-rotate-90' : ''
                                        }`}
                                    />
                                    <span>{board.name}</span>
                                    <span className="text-xs ml-2 text-bcc0c7 font-normal uppercase">
                                        {board.tasks.length} tasks
                                    </span>
                                </div>
                            </div>
                            {collapsed && (
                                <div className="px-4">{groupTasks}</div>
                            )}
                        </div>
                    </DndContext>
                </DragDropContext>
            )}
        </div>
    )
}

export default memo(forwardRef(BoardView))
