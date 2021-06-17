import {Component} from 'react'
import './assets/SideBar.css'

class SideBar extends Component {

    renderSpaces = () => {
        return this.props.data.spaces.map(data => {
            return (
                <div className="board" key={data.name}>
                    <div>
                        <i className="fas fa-cloud"> </i>
                        <p>{data.name}</p>
                    </div>
                    {data.boards.map(data => {
                        return <span key={data.name}>{data.name}</span>
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
                </div>
            </div>
        );
    }
}

export default SideBar