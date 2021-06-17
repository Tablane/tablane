import {Component} from 'react'
import './assets/SideBar.css'

class SideBar extends Component {
    render() {
        return (
            <div className="SideBar">
                <div className="header">
                    <div className="logo">
                        <p>ClickUp</p>
                    </div>
                    <div className="icons">
                        <i className="fas fa-cog"> </i>
                        <i className="fas fa-angle-double-left"> </i>
                    </div>
                </div>
                <div className="boards">
                    <label>Spaces</label>
                    <div className="new-btn">
                        <button><i className="fas fa-plus"> </i>New Space</button>
                    </div>

                    <div className="board all">
                        <div>
                            <i className="fas fa-cloud"> </i>
                            <p>Everything</p>
                        </div>
                    </div>

                    <div className="board">
                        <div>
                            <i className="fas fa-cloud"> </i>
                            <p>Server Project</p>
                        </div>
                        <span>TTT</span>
                        <span>Lobby</span>
                        <span>Server</span>
                    </div>

                    <div className="board">
                        <div>
                            <i className="fas fa-cloud"> </i>
                            <p>External Projects</p>
                        </div>
                        <span>BanSystem</span>
                        <span>Effects</span>
                    </div>

                    <div className="board">
                        <div>
                            <i className="fas fa-cloud"> </i>
                            <p>Dev Projects</p>
                        </div>
                        <span>TaskBoard</span>
                        <span>bCrypt</span>
                        <span>AirDrop</span>
                    </div>

                </div>
                <div className="account">
                    <p>account stuff</p>
                </div>
            </div>
        );
    }
}

export default SideBar