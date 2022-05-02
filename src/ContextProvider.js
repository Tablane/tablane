import {useCallback, useEffect, useMemo, useState} from 'react'
import './App.css';
import BoardContext from "./modules/context/BoardContext";
import axios from "axios";
import {toast} from "react-hot-toast";
import SyncErrorContext from "./modules/context/SyncErrorContext";

function ContextProvider(props) {
    const [boardId, setBoardId] = useState(null)
    const [board, setBoard] = useState(null)
    const [syncError, setSyncError] = useState(false)

    const getBoardData = useCallback(async (newBoardId) => {
        const checkedBoard = newBoardId ? newBoardId : boardId
        if (!checkedBoard) return
        if (newBoardId) setBoardId(newBoardId)

        await axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/board/${checkedBoard}`
        }).then(res => {
            setBoard(res.data)
        }).catch(err => {
            toast(err.toString())
        })
    }, [boardId])

    useEffect(() => {
        getBoardData()
    }, [])

    const boardProviderValue = useMemo(() => ({ board, setBoard, getBoardData }), [board, getBoardData])
    const syncErrorProviderValue = useMemo(() => ({ syncError, setSyncError }), [syncError, setSyncError])

    return (
        <BoardContext.Provider value={boardProviderValue}>
            <SyncErrorContext.Provider value={syncErrorProviderValue}>
                {props.children}
            </SyncErrorContext.Provider>
        </BoardContext.Provider>
    );
}

export default ContextProvider
