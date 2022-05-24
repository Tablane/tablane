import '../../styles/TopMenu.css'
import ShareDialog from "./topMenu/ShareDialog";
import useToggleState from "../../modules/hooks/useToggleState";
import { useSelector } from "react-redux";

function TopMenu(props) {
    const { board } = useSelector(state => state.board)
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
    )
}

export default TopMenu