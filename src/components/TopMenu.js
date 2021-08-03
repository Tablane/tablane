import {Component} from 'react'
import './assets/TopMenu.css'
import {connect} from "react-redux";
import ShareDialog from "./partials/ShareDialog";

class TopMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shareDialogOpen: false
        }
    }

    toggleShareDialog = () => {
        this.setState(st => ({
            shareDialogOpen: !st.shareDialogOpen
        }))
    }

    render() {
        return (
            <div className="TopMenu">
                <div className="details">
                    {this.props.sideBarClosed && (
                        <i onClick={this.props.toggleSideBar} className="fas fa-angle-double-right"> </i>
                    )}
                    <div className="pic">
                        <div> </div>
                    </div>
                    <div className="info">
                        <h1>{this.props.board ? this.props.board.name : 'Everything'}</h1>
                        <span>Add details</span>
                    </div>
                </div>
                <div>
                    <button className="share" onClick={this.toggleShareDialog}>
                        <i className="fas fa-share-alt"> </i>
                        <p>Share</p>
                    </button>
                </div>

                {this.props.board && (
                    <ShareDialog
                        board={this.props.board}
                        open={this.state.shareDialogOpen}
                        handleClose={this.toggleShareDialog} />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(TopMenu)