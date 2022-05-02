import {useContext} from 'react'
import '../../components/assets/TopMenu.css'
import ShareDialog from "./topMenu/ShareDialog";
import BoardContext from "../../modules/context/BoardContext";
import useToggleState from "../../modules/hooks/useToggleState";

function TopMenu(props) {
    const {board} = useContext(BoardContext)
    const [shareDialogOpen, toggleShareDialogOpen] = useToggleState(false)

    return (
        <div className="TopMenu">
            <div className="details">
                {props.sideBarClosed && (
                    <i onClick={props.toggleSideBar} className="fas fa-angle-double-right"> </i>
                )}
                <div className="pic">
                    <div> </div>
                </div>
                <div className="info">
                    <h1>{props.board ? props.board.name : 'Everything'}</h1>
                    <span>Add details</span>
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
    )
}

export default TopMenu