import '../../../styles/Board.css'
import { Navigate, useParams } from 'react-router-dom'
import { useFetchWorkspaceQuery } from '../../../modules/services/workspaceSlice'
import { useFetchBoardQuery } from '../../../modules/services/boardSlice'
import BoardView from './board/BoardView'
import { forwardRef, useCallback } from 'react'

function Board(props, viewContainerRef) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data: board, error, isFetching } = useFetchBoardQuery(props.boardId)

    const hasPerms = useCallback(permission => {
        return true
    }, [])

    if (error && !isFetching) {
        return <Navigate to={`/${workspace.id}`} />
    }

    return (
        <BoardView ref={viewContainerRef} board={board} hasPerms={hasPerms} />
    )
}

export default forwardRef(Board)
