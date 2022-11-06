import { useMemo, useState } from 'react'
import '../../../styles/Board.css'
import TaskGroup from './board/TaskGroup'
import { DragDropContext } from '@hello-pangea/dnd'
import _ from 'lodash'
import { Navigate, useParams } from 'react-router-dom'
import { useFetchWorkspaceQuery } from '../../../modules/services/workspaceSlice'
import {
    useFetchBoardQuery,
    useSortAttributeMutation,
    useSortTaskMutation
} from '../../../modules/services/boardSlice'
import ExpandCircleIcon from '../../../styles/assets/ExpandCircleIcon'

function Board(props) {
    const [sortAttribute] = useSortAttributeMutation()
    const [sortTask] = useSortTaskMutation()
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const [groupedTasks, setGroupedTasks] = useState([])
    const { data: board, error, isFetching } = useFetchBoardQuery(props.boardId)
    const [collapsed, setCollapsed] = useState(true)

    const groupTasks = useMemo(() => {
        if (!board) return
        if (!board.groupBy || board.groupBy === 'none') {
            return (
                <TaskGroup
                    board={board}
                    color={'rgb(196, 196, 196)'}
                    name=""
                    taskGroupId={'empty'}
                    tasks={board.tasks}
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

        board.tasks.map(task => {
            const value = task.options.find(
                option => option.column === board.groupBy
            )?.value
            const label = labels.find(label => label._id === value)
            if (value && label) label.tasks.push(task)
            else labels.find(label => label._id === 'empty').tasks.push(task)
        })

        setGroupedTasks(labels)

        return labels.map(label => (
            <TaskGroup
                groupedTasks={labels}
                board={board}
                color={label.color}
                key={label._id}
                name={label.name}
                taskGroupId={label._id}
                tasks={label.tasks}
            />
        ))
    }, [board])

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

    if (error && !isFetching) {
        return <Navigate to={`/${workspace.id}`} />
    }
    return (
        <div className="pb-0 pt-2 pl-8">
            {!isFetching && board && (
                <DragDropContext
                    onDragEnd={handleDragEnd}
                    onDragStart={onDragStart}
                >
                    <div className="border border-borderGrey rounded-md font-medium mr-6">
                        <div className="px-4 h-9 flex justify-content items-center">
                            <div
                                className="flex justify-content items-center px-1 rounded cursor-pointer hover:bg-bcc0c74d"
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
                        {collapsed && <div className="px-4">{groupTasks}</div>}
                    </div>
                </DragDropContext>
            )}
        </div>
    )
}

export default Board
