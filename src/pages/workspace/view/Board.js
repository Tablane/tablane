import '../../../styles/Board.css'
import { Navigate, useParams } from 'react-router-dom'
import { useFetchWorkspaceQuery } from '../../../modules/services/workspaceSlice'
import { useFetchBoardQuery } from '../../../modules/services/boardSlice'
import BoardView from './board/BoardView'
import { useFetchUserQuery } from '../../../modules/services/userSlice'

function Board(props) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    const { data: user } = useFetchUserQuery()
    const { data: board, error, isFetching } = useFetchBoardQuery(props.boardId)

    if (error && !isFetching) {
        return <Navigate to={`/${workspace.id}`} />
    }

    const hasPerms = permission => {
        return true
    }

    return <BoardView board={board} hasPerms={hasPerms} />
}

export default Board
