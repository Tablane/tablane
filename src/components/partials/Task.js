import {Component} from 'react'
import './assets/Task.css'

class Task extends Component {
    render() {
        return (
            <div className="Task">
                <p>{this.props.name}</p>
                <div>
                    <p>prop 1</p>
                    <p>prop 2</p>
                    <p>prop 3</p>
                </div>
            </div>
        );
    }
}

export default Task