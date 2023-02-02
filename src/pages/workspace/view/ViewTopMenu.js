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
import ListIcon from '../../../styles/assets/ListIcon.tsx'

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
        if (!board?.groupBy || board.groupBy === 'none') return false
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
                        <div
                            onClick={toggleSideBar}
                            className="mr-[15px] cursor-pointer"
                        >
                            <FontAwesomeIcon
                                icon={solid('angle-double-right')}
                            />
                        </div>
                    )}
                    <div className="pic">
                        <div> </div>
                    </div>
                    <div className="info">
                        <h1>{board?.name || '...'}</h1>
                    </div>
                    {/*<div className="flex flex-row justify-center items-center h-full mx-[15px] my-0">*/}
                    {/*    {[*/}
                    {/*        {*/}
                    {/*            name: 'List',*/}
                    {/*            icon: <ListIcon className="h-5 w-5 mr-2" />,*/}
                    {/*            active: true*/}
                    {/*        },*/}
                    {/*        {*/}
                    {/*            name: 'Bugs',*/}
                    {/*            icon: <ListIcon className="h-5 w-5 mr-2" />,*/}
                    {/*            active: false*/}
                    {/*        }*/}
                    {/*    ].map(({ name, icon, active }) => (*/}
                    {/*        <div*/}
                    {/*            key={name}*/}
                    {/*            className={`flex justify-center items-center h-[60px] box-border cursor-pointer border-y-[3px] border-y-[white] border-solid ${*/}
                    {/*                active ? 'border-b-[#4169e1]' : ''*/}
                    {/*            }`}*/}
                    {/*        >*/}
                    {/*            <div*/}
                    {/*                className={`flex justify-center items-center h-[25px] px-3 py-0 border-l-[#e9ebf1] border-l border-solid ${*/}
                    {/*                    active*/}
                    {/*                        ? 'text-[#4169e1]'*/}
                    {/*                        : 'text-[#7c828d]'*/}
                    {/*                }`}*/}
                    {/*            >*/}
                    {/*                {icon}*/}
                    {/*                <span*/}
                    {/*                    className={`text-sm leading-[14px] font-medium ${*/}
                    {/*                        active*/}
                    {/*                            ? 'text-[#4169e1]'*/}
                    {/*                            : 'text-[#7c828d]'*/}
                    {/*                    }`}*/}
                    {/*                >*/}
                    {/*                    {name}*/}
                    {/*                </span>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
                <div className="pr-4">
                    <button
                        className="share m-h-[32px]"
                        onClick={toggleShareDialogOpen}
                    >
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
                    <div
                        className={`group-by ${
                            groupBy() ? 'bg-[#eaedfb] text-[#4169e1]' : ''
                        }`}
                        onClick={handleGroupByOpen}
                    >
                        <FontAwesomeIcon
                            className={`${
                                groupBy() ? 'text-[#4169e1]' : 'text-[#333333]'
                            }`}
                            icon={solid('layer-group')}
                        />
                        <p
                            className={`${
                                groupBy() ? 'text-[#4169e1]' : 'text-[#333333]'
                            }`}
                        >
                            Group by: {groupBy() || 'None'}
                        </p>
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
