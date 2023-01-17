import '../../../styles/TopMenu.scss'
import ShareDialog from '../topMenu/ShareDialog'
import useToggleState from '../../../modules/hooks/useToggleState.tsx'
import GroupByPopover from '../topMenu/GroupByPopover'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useFetchBoardQuery } from '../../../modules/services/boardSlice.ts'
import { useAtom } from 'jotai'
import { searchAtom } from '../../../utils/atoms.ts'
import { useParams } from 'react-router-dom'
import FilterMenu from './viewTopMenu/FilterMenu.tsx'

function ViewTopMenu({ boardId, sideBarClosed, toggleSideBar }) {
    const { data: board } = useFetchBoardQuery(boardId)
    const [shareDialogOpen, toggleShareDialogOpen] = useToggleState(false)
    const [groupByOpen, setGroupByOpen] = useState(null)
    const [search, setSearch] = useAtom(searchAtom)
    const params = useParams()

    useEffect(() => {
        setSearch('')
    }, [params.board])

    const handleChange = e => {
        setSearch(e.target.value)
    }

    const groupBy = () => {
        if (!board?.groupBy || board.groupBy === 'none') return 'None'
        return board.attributes.find(
            attribute => attribute._id === board.groupBy
        ).name
    }

    const handleGroupByOpen = e => {
        setGroupByOpen(e.currentTarget)
    }

    return (
        <div className="TopMenu">
            <div>
                <div className="details flex justify-start items-center h-full pl-4">
                    {sideBarClosed && (
                        <FontAwesomeIcon
                            icon={solid('angle-double-right')}
                            onClick={toggleSideBar}
                        />
                    )}
                    <div className="pic">
                        <div> </div>
                    </div>
                    <div className="info">
                        <h1>{board?.name || '...'}</h1>
                    </div>
                </div>
                <div className="pr-4">
                    <button className="share" onClick={toggleShareDialogOpen}>
                        <FontAwesomeIcon icon={solid('share-alt')} />
                        <p>Share</p>
                    </button>
                </div>

                {board && (
                    <ShareDialog
                        board={board}
                        open={shareDialogOpen}
                        handleClose={toggleShareDialogOpen}
                    />
                )}
            </div>

            <div className="view-options">
                <div className="task-search">
                    {/*<div className="flex justify-center items-center text-xs h-full mx-4">*/}
                    {/*    <label>*/}
                    {/*        <FontAwesomeIcon*/}
                    {/*            className=""*/}
                    {/*            icon={solid('magnifying-glass')}*/}
                    {/*        />*/}
                    {/*        <input*/}
                    {/*            placeholder="Search tasks..."*/}
                    {/*            className="outline-none ml-2"*/}
                    {/*            type="text"*/}
                    {/*            value={search}*/}
                    {/*            onChange={handleChange}*/}
                    {/*        />*/}
                    {/*    </label>*/}
                    {/*    <div className="border-r border-[#e9ebf0] ml-4 h-5"></div>*/}
                    {/*</div>*/}
                </div>
                <div className="task-filter">
                    {board && <FilterMenu boardId={boardId} />}
                    <div className="group-by" onClick={handleGroupByOpen}>
                        <FontAwesomeIcon
                            className="text-[#53575E]"
                            icon={solid('layer-group')}
                        />
                        <p className="text-[#333333]">Group by: {groupBy()}</p>
                    </div>
                </div>
            </div>

            <GroupByPopover
                board={board}
                groupByOpen={groupByOpen}
                setGroupByOpen={setGroupByOpen}
            />
        </div>
    )
}

export default ViewTopMenu
