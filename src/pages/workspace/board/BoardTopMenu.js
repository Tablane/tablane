import '../../../styles/TopMenu.scss'
import ShareDialog from '../topMenu/ShareDialog'
import useToggleState from '../../../modules/hooks/useToggleState'
import GroupByPopover from '../topMenu/GroupByPopover'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function BoardTopMenu({ board, sideBarClosed, toggleSideBar }) {
    const [shareDialogOpen, toggleShareDialogOpen] = useToggleState(false)
    const [groupByOpen, setGroupByOpen] = useState(null)

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
                <div className="details">
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
                <div>
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
                <div className="task-search"></div>
                <div className="task-filter">
                    <div className="group-by" onClick={handleGroupByOpen}>
                        <FontAwesomeIcon icon={solid('layer-group')} />
                        <p>Group by: {groupBy()}</p>
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

export default BoardTopMenu
