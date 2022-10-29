import { useCallback, useMemo, useState } from 'react'
import '../../styles/Board.css'
import TaskGroup from './board/TaskGroup'
import { DragDropContext } from '@hello-pangea/dnd'
import { LinearProgress } from '@mui/material'
import _ from 'lodash'
import { Navigate, useParams } from 'react-router-dom'
import BoardTopMenu from './board/BoardTopMenu'
import { useFetchWorkspaceQuery } from '../../modules/services/workspaceSlice'
import {
    useFetchBoardQuery,
    useSortAttributeMutation,
    useSortTaskMutation
} from '../../modules/services/boardSlice'
import { toast } from 'react-hot-toast'

function Board(props) {
    const [sortAttribute] = useSortAttributeMutation()
    const [sortTask] = useSortTaskMutation()
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)

    const [groupedTasks, setGroupedTasks] = useState([])

    const findBoardId = useCallback(() => {
        const space = params.space.replaceAll('-', ' ')
        const board = params.board.replaceAll('-', ' ')
        return workspace?.spaces
            .find(x => x.name === space)
            ?.boards.find(x => x.name === board)?._id
    }, [params.space, params.board, workspace?.spaces, workspace])
    const boardId = findBoardId()
    const { data: board, error, isFetching } = useFetchBoardQuery(boardId)

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

    if (error) {
        return <Navigate to={`/${workspace.id}`} />
    }
    return (
        <>
            <BoardTopMenu
                board={board}
                toggleSideBar={props.toggleSideBar}
                sideBarClosed={!props.sidebarOpen}
            />
            <div className="Board">
                <div>
                    {isFetching ? (
                        <LinearProgress />
                    ) : (
                        <div className="loading-placeholder"></div>
                    )}
                    {!isFetching && board && (
                        <DragDropContext
                            onDragEnd={handleDragEnd}
                            onDragStart={onDragStart}
                        >
                            <div className="task-group">{groupTasks}</div>
                        </DragDropContext>
                    )}
                </div>
            </div>
        </>
    )
}

export default Board
