import {Component} from 'react'
import './assets/SideBar.css'
import {Link} from 'react-router-dom'

class SideBar extends Component {

    renderSpaces = () => {
        return this.props.data.spaces.map(space => {
            return (
                <div className="board" key={space.name}>
                    <div>
                        <i className="fas fa-cloud"> </i>
                        <p>{space.name}</p>
                    </div>
                    {space.boards.map(board => {
                        return (
                            <Link to={`/boards/${space.name.replace(' ', '-')}/${board.name.replace(' ', '-')}`} key={board.name}>
                                <span key={board.name}>{board.name}</span>
                            </Link>
                        )
                    })}
                </div>
            )
        })
    }

    render() {
        return (
            <div className="SideBar">
                <div className="header">
                    <div className="logo">
                        <Link to="/">
                            <p>Task Board</p>
                        </Link>
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

                    <div className="board">
                        <div>
                            <i className="fas fa-cloud"> </i>
                            <p>Everything</p>
                        </div>
                    </div>

                    {this.renderSpaces()}

                </div>
                <div className="account">
                    <p>account stuff</p>
                    <button onClick={() => this.props.changeToken('')}>logout</button>
                </div>
            </div>
        );
    }
}

export default SideBar