import './App.css';
import Board from './components/Board'
import SideBar from './components/SideBar'
import TopMenu from './components/TopMenu'

function App() {
    return (
        <div className="App">
            <SideBar/>
            <TopMenu/>
            <Board/>
        </div>
    );
}

export default App;
