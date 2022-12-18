import { forwardRef, memo, useCallback, useMemo, useState } from 'react'
import '../../../../styles/TaskGroup.css'
import Task from '../board/taskGroup/Task'
import AttributePopover from '../board/taskGroup/AttributePopover'
import AddAttributePopover from '../board/taskGroup/AddAttributePopover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import ExpandCircleIcon from '../../../../styles/assets/ExpandCircleIcon'
import PlusIcon from '../../../../styles/assets/PlusIcon'
import NewTaskForm from './taskGroup/NewTaskForm'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { defaultDropAnimation, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import { useSortTaskMutation } from '../../../../modules/services/boardSlice'
import _ from 'lodash'
import { buildTree, flatten } from '../../../../utils/taskUtils'
import { Virtuoso } from 'react-virtuoso'
import produce from 'immer'

function TaskGroup(props, viewContainerRef) {
    const { hasPerms, tasks, boardId, groupBy, attributes } = props
    const [collapsed, setCollapsed] = useState(false)
    const [activeItem, setActiveItem] = useState(null)
    const [collapsedItems, setCollapsedItems] = useState([])
    const [sortTask] = useSortTaskMutation()

    // attribute popover
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [popoverId, setPopoverId] = useState('')

    // add new attribute popover
    const [newAttributeOpen, setNewAttributeOpen] = useState(false)

    const handleAddNewAttribute = (e = false) => {
        setNewAttributeOpen(e ? e.target.parentNode.parentNode : false)
    }

    const handleAttributePopover = (e, id = null) => {
        setPopoverId(id ? id : popoverId)
        setPopoverOpen(e ? e.target.parentNode : null)
    }

    const removeChildrenOf = (items, ids) => {
        const excludeParentIds = [...ids]

        return items.filter(item => {
            if (item.parentTask && excludeParentIds.includes(item.parentTask)) {
                excludeParentIds.push(item._id)
                return false
            }

            return true
        })
    }

    const flattenedTasks = useMemo(() => {
        const flattenedTasks = produce(tasks, draft => {
            return removeChildrenOf(
                draft,
                activeItem?._id
                    ? [activeItem._id, ...collapsedItems]
                    : collapsedItems
            )
        })
        return flattenedTasks
    }, [tasks, activeItem?._id, collapsedItems])

    const taskIds = useMemo(
        () => flattenedTasks.map(task => task._id),
        [flattenedTasks]
    )

    const arrayMove = (array, from, to) => {
        const newArray = array.slice()
        newArray.splice(
            to < 0 ? newArray.length + to : to,
            0,
            newArray.splice(from, 1)[0]
        )

        return newArray
    }

    const [overItem, setOverItem] = useState(null)
    const [offsetLeft, setOffsetLeft] = useState(0)

    const getDepth = useCallback(() => {
        const activeIndex = flattenedTasks.findIndex(
            x => x._id === activeItem?._id
        )
        const overIndex = flattenedTasks.indexOf(overItem)
        const newItems = arrayMove(flattenedTasks, activeIndex, overIndex)

        const prevTask = newItems[overIndex - 1]
        const nextTask = newItems[overIndex + 1]

        const maxDepth = prevTask ? prevTask.level + 1 : 0
        const minDepth = nextTask ? nextTask.level : 0

        let depth = Math.round(offsetLeft / 32)
        if (depth > maxDepth) depth = maxDepth
        if (depth < minDepth) depth = minDepth

        return depth
    }, [flattenedTasks, activeItem?._id, overItem?._id, offsetLeft])

    const getParentId = (level, overId, activeId) => {
        const overIndex = flattenedTasks.findIndex(x => x._id === overId)
        const activeIndex = flattenedTasks.findIndex(x => x._id === activeId)
        const newItems = arrayMove(flattenedTasks, activeIndex, overIndex)
        const prevItem = newItems[overIndex - 1]

        if (level === 0 || !prevItem) {
            return null
        }

        if (level === prevItem.level) {
            return prevItem.parentTask
        }

        if (level > prevItem.level) {
            return prevItem._id
        }

        const newParent = flattenedTasks
            .slice(0, overIndex)
            .reverse()
            .find(item => item.level === level)?.parentId

        return newParent ?? null
    }

    const handleCollapse = useCallback(id => {
        setCollapsedItems(collapsedItems => {
            const index = collapsedItems.indexOf(id)
            if (index === -1) {
                return [...collapsedItems, id]
            } else {
                return collapsedItems.filter(x => x !== id)
            }
        })
    }, [])

    useDndMonitor({
        onDragStart({ active: { id } }) {
            setOverItem(flattenedTasks.find(x => x._id === id))
            setActiveItem(flattenedTasks.find(x => x._id === id))
        },
        onDragMove({ delta }) {
            setOffsetLeft(delta.x)
        },
        onDragOver({ over }) {
            setOverItem(
                flattenedTasks[over.data.current.sortable.index] ?? null
            )
        },
        onDragEnd({ active, over }) {
            const clonedTasks = _.cloneDeep(tasks)
            const overIndex = clonedTasks.findIndex(x => x._id === over.id)
            const activeIndex = clonedTasks.findIndex(x => x._id === active.id)

            clonedTasks[activeIndex] = {
                ...clonedTasks[activeIndex],
                level: getDepth(),
                parentTask: getParentId(getDepth(), over.id, active.id)
            }

            const sortedTasks = arrayMove(clonedTasks, activeIndex, overIndex)

            sortTask({
                newItems: flatten(buildTree(sortedTasks)),
                boardId,
                taskId: clonedTasks[activeIndex]._id,
                newParentTask: getParentId(getDepth(), over.id, active.id),
                index: overIndex,
                overId: over.id
            })

            setActiveItem(null)
        },
        onDragCancel(event) {
            setActiveItem(null)
        }
    })

    const dropAnimationConfig = {
        keyframes({ transform }) {
            return [
                {
                    opacity: 1,
                    transform: CSS.Transform?.toString(transform.initial)
                },
                {
                    opacity: 0,
                    transform: CSS.Transform?.toString({
                        ...transform.final,
                        x: transform.final.x + 5,
                        y: transform.final.y + 5
                    })
                }
            ]
        },
        easing: 'ease-out',
        sideEffects({ active }) {
            active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: defaultDropAnimation.duration,
                easing: defaultDropAnimation.easing
            })
        }
    }

    const adjustTranslate = ({ transform }) => {
        return {
            ...transform,
            y: transform.y - 25
        }
    }

    return (
        <div className="task mb-7 font-normal">
            <div className="title ml-4 sticky top-0 z-20 pt-6 bg-[#eee]">
                <div className="min-w-[220px] sm:min-w-[420px] sticky left-[-20px] bg-backgroundGrey flex-grow flex-shrink-0 basis-[220px] sm:basis-[420px] flex justify-start items-center">
                    <ExpandCircleIcon
                        className={`h-4 w-4 text-bcc0c7 mr-1 transition-transform cursor-pointer ${
                            collapsed ? '-rotate-90' : ''
                        }`}
                        style={{ fill: props.color }}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <div
                        className={`taskGroup-title h-6 rounded-[3px] ${
                            collapsed ? '' : 'rounded-b-none'
                        }`}
                        style={{ backgroundColor: props.color }}
                    >
                        <p style={{ color: !props.name && '' }}>
                            {props.name || 'Empty'}
                        </p>
                    </div>
                    <p className="task-amount font-medium text-xs text-adb3bd">
                        {props.tasks.length} TASKS
                    </p>
                </div>
                <Droppable
                    droppableId={props.taskGroupId + 'attribute'}
                    direction="horizontal"
                    type={`attribute ${props.taskGroupId}`}
                >
                    {provided => (
                        <div
                            className={`attributes flex justify-center items-center ${
                                collapsed ? 'opacity-0' : ''
                            }`}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {attributes.map((x, i) => {
                                return (
                                    <Draggable
                                        draggableId={props.taskGroupId + x._id}
                                        isDragDisabled={
                                            !hasPerms('MANAGE:COLUMN')
                                        }
                                        index={i}
                                        key={props.taskGroupId + x._id}
                                    >
                                        {provided => (
                                            <div
                                                className="attribute font-medium min-w-[120px]"
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                            >
                                                <FontAwesomeIcon
                                                    icon={solid('caret-down')}
                                                    className={`${
                                                        hasPerms(
                                                            'MANAGE:COLUMN'
                                                        )
                                                            ? ''
                                                            : 'hidden'
                                                    }`}
                                                />
                                                <p className="text-xs text-adb3bd">
                                                    {x.name}
                                                </p>
                                                <FontAwesomeIcon
                                                    icon={solid('caret-down')}
                                                    className={`cursor-pointer text-[#b9bec7] hover:text-[#7c828d] ${
                                                        hasPerms(
                                                            'MANAGE:COLUMN'
                                                        )
                                                            ? ''
                                                            : 'hidden'
                                                    }`}
                                                    onClick={e =>
                                                        handleAttributePopover(
                                                            e,
                                                            x
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                            <div className="attribute min-w-[44px]">
                                <p
                                    onClick={handleAddNewAttribute}
                                    className={`cursor-pointer ${
                                        hasPerms('MANAGE:TASK') ? '' : 'hidden'
                                    }`}
                                >
                                    <PlusIcon className="h-4 text-adb3bd" />
                                </p>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
            {!collapsed &&
                !(flattenedTasks.length === 0 && !hasPerms('CREATE:TASK')) && (
                    <>
                        <SortableContext
                            items={taskIds}
                            strategy={verticalListSortingStrategy}
                        >
                            <div
                                className={`tasks ml-9 border-2 border-b border-white rounded-t-sm box-border ${
                                    hasPerms('CREATE:TASK')
                                        ? ''
                                        : 'rounded-b-sm'
                                }`}
                            >
                                <Virtuoso
                                    customScrollParent={
                                        viewContainerRef.current
                                    }
                                    overscan={{ main: 15, reverse: 15 }}
                                    data={flattenedTasks}
                                    defaultItemHeight={37}
                                    totalCount={flattenedTasks.length}
                                    itemContent={(i, task) => (
                                        <Task
                                            handleCollapse={handleCollapse}
                                            groupedTasks={props.groupedTasks}
                                            hasPerms={hasPerms}
                                            boardId={boardId}
                                            groupBy={groupBy}
                                            attributes={attributes}
                                            key={task._id}
                                            members={props.members}
                                            task={
                                                task._id === activeItem?._id
                                                    ? {
                                                          ...task,
                                                          level: getDepth()
                                                      }
                                                    : task
                                            }
                                            index={i}
                                            taskGroupId={props.taskGroupId}
                                        />
                                    )}
                                />
                                {createPortal(
                                    <DragOverlay
                                        dropAnimation={dropAnimationConfig}
                                        modifiers={
                                            false
                                                ? [adjustTranslate]
                                                : undefined
                                        }
                                    >
                                        {activeItem ? (
                                            <div className="opacity-50 px-4 w-fit bg-white shadow h-8 rounded flex justify-center items-center">
                                                {activeItem.name}
                                            </div>
                                        ) : null}
                                    </DragOverlay>,
                                    document.body
                                )}
                            </div>
                            {hasPerms('CREATE:TASK') && (
                                <NewTaskForm
                                    boardId={boardId}
                                    taskGroupId={props.taskGroupId}
                                />
                            )}
                        </SortableContext>
                    </>
                )}

            <AttributePopover
                boardId={boardId}
                open={popoverOpen}
                close={handleAttributePopover}
                attr={popoverId}
            />
            <AddAttributePopover
                boardId={boardId}
                anchor={newAttributeOpen}
                close={handleAddNewAttribute}
            />
        </div>
    )
}

export default memo(forwardRef(TaskGroup))
