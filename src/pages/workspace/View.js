import Board from './view/Board'
import ViewTopMenu from './view/ViewTopMenu'
import { useCallback, useRef } from 'react'
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
    const { isFetching } = useFetchBoardQuery(boardId)
    const viewContainerRef = useRef(null)

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
                    <div
                        ref={viewContainerRef}
                        className="flex-grow bg-backgroundGrey overflow-auto"
                    >
                        <Board
                            ref={viewContainerRef}
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
