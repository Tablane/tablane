import {Component} from 'react'
import './assets/TopMenu.css'
import {connect} from "react-redux";

class TopMenu extends Component {
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
                    <button className="share">
                        <i className="fas fa-share-alt"> </i>
                        <p>Share</p>
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(TopMenu)