import Board from './view/Board'
import ViewTopMenu from './view/ViewTopMenu'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFetchWorkspaceQuery } from '../../modules/services/workspaceSlice'
import { LinearProgress } from '@mui/material'
import { useFetchBoardQuery } from '../../modules/services/boardSlice'

function View({ level, view, sidebarOpen, toggleSideBar }) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const findBoardId = useCallback(() => {
        const space = params.space.replaceAll('-', ' ')
        const board = params.board.replaceAll('-', ' ')
        return workspace?.spaces
            .find(x => x.name === space)
            ?.boards.find(x => x.name === board)?._id
    }, [params.space, params.board, workspace?.spaces, workspace])
    const boardId = findBoardId()
    const { data: board, isFetching } = useFetchBoardQuery(boardId)

    if (level === 'list') {
        if (view === 'list')
            return (
                <>
                    <ViewTopMenu
                        boardId={boardId}
                        toggleSideBar={toggleSideBar}
                        sideBarClosed={!sidebarOpen}
                    />
                    <div className="h-1 bg-backgroundGrey">
                        {isFetching && <LinearProgress />}
                    </div>
                    <div className="flex-grow bg-backgroundGrey overflow-auto">
                        <Board
                            boardId={boardId}
                            sidebarOpen={sidebarOpen}
                            toggleSideBar={toggleSideBar}
                        />
                    </div>
                </>
            )
    }
}

export default View
