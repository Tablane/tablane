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
                    <label>Boards</label>
                    <ul>
                        <li>Server Project</li>
                        <ul>
                            <li>TTT</li>
                            <li>Lobby</li>
                            <li>Server</li>
                        </ul>
                        <li>External Projects</li>
                        <ul>
                            <li>BanSystem</li>
                            <li>Effects</li>
                        </ul>
                        <li>Dev Projects</li>
                        <ul>
                            <li>TaskBoard</li>
                            <li>bCrypt</li>
                            <li>AirDrop</li>
                        </ul>
                    </ul>
                </div>
                <div className="account">
                    <p>account stuff</p>
                </div>
            </div>
        );
    }
}

export default SideBar