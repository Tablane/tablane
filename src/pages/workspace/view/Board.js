import '../../../styles/Board.css'
import { useParams } from 'react-router-dom'
import { useFetchWorkspaceQuery } from '../../../modules/services/workspaceSlice'
import { useFetchBoardQuery } from '../../../modules/services/boardSlice.ts'
import BoardView from './board/BoardView'
import { forwardRef, useCallback } from 'react'

function Board({ boardId }, viewContainerRef) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data: board } = useFetchBoardQuery({
        boardId,
        viewShortId: params.view
    })
    const view = board?.views.find(x => x.id === params.view)

    const hasPerms = useCallback(permission => {
        return true
    }, [])

    return (
        <BoardView
            ref={viewContainerRef}
            members={workspace.members}
            board={board}
            view={view}
            hasPerms={hasPerms}
        />
    )
}

export default forwardRef(Board)
