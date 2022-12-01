import { Link, useParams } from 'react-router-dom'
import styles from '../styles/SharedBoard.module.scss'
import { CircularProgress } from '@mui/material'
import BoardView from './workspace/view/board/BoardView'
import { useFetchSharedBoardQuery } from '../modules/services/sharedContentSlice'

function SharedBoard() {
    const { boardId } = useParams()
    const {
        data: board,
        isError,
        isLoading
    } = useFetchSharedBoardQuery(boardId)

    const hasPerms = () => false

    if (isLoading) {
        return (
            <div className="flex h-[100vh] justify-center items-center">
                <CircularProgress />
            </div>
        )
    }
    if (isError || isLoading) {
        return (
            <div className={styles.forbidden}>
                <div>
                    <p className="my-3">This page is currently unavailable</p>
                    <p className="my-3">
                        <span>To create your own public tasks or views, </span>
                        <Link
                            className="pointer underline text-[#4169e1]"
                            to="/login"
                        >
                            create an account
                        </Link>
                        <span> for free!</span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#eee] overflow-auto h-[100vh]">
            <BoardView
                hasPerms={hasPerms}
                board={board}
                sidebarOpen={false}
                toggleSideBar={() => {}}
            />
        </div>
    )
}

export default SharedBoard
