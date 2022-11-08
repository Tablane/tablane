import { useParams } from 'react-router-dom'
import Board from './workspace/view/Board'
import { useFetchSharedBoardQuery } from '../modules/services/boardSlice'
import styles from '../styles/SharedBoard.module.scss'
import { CircularProgress } from '@mui/material'

function SharedBoard() {
    const { boardId } = useParams()
    const { isError, isLoading } = useFetchSharedBoardQuery(boardId)

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
                        To create your own public tasks or views,{' '}
                        <span>create an account</span> for free!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#eee] overflow-auto h-[100vh]">
            <Board
                boardId={boardId}
                sidebarOpen={false}
                toggleSideBar={() => {}}
            />
        </div>
    )
}

export default SharedBoard
