import '../../styles/TopMenu.scss'
import ShareDialog from "./topMenu/ShareDialog";
import useToggleState from "../../modules/hooks/useToggleState";
import { useSelector } from "react-redux";
import GroupByPopover from "./topMenu/GroupByPopover";
import {useState} from "react";

function TopMenu(props) {
    const { board } = useSelector(state => state.board)
    const [shareDialogOpen, toggleShareDialogOpen] = useToggleState(false)
    const [groupByOpen, setGroupByOpen] = useState(null)

    const groupBy = () => {
        if (!board?.groupBy || board.groupBy === 'none') return 'None'
        return board.attributes.find(attribute => attribute._id === board.groupBy).name
    }

    const handleGroupByOpen = e => {
        setGroupByOpen(e.currentTarget)
    }

    return (
        <div className="TopMenu">
            <div>
                <div className="details">
                    {props.sideBarClosed && (
                        <i onClick={props.toggleSideBar} className="fas fa-angle-double-right"> </i>
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
                        <i className="fas fa-share-alt"> </i>
                        <p>Share</p>
                    </button>
                </div>

                {board && (
                    <ShareDialog
                        open={shareDialogOpen}
                        handleClose={toggleShareDialogOpen} />
                )}
            </div>

            <div className="view-options">
                <div className="task-search">

                </div>
                <div className="task-filter">
                    <div className="group-by" onClick={handleGroupByOpen}>
                        <i className="fas fa-layer-group"></i>
                        <p>Group by: {groupBy()}</p>
                    </div>
                </div>
            </div>

            <GroupByPopover groupByOpen={groupByOpen} setGroupByOpen={setGroupByOpen} />
        </div>
    )
}

export default TopMenu