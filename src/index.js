import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Toaster} from "react-hot-toast";
import {createStore} from "redux";
import {Provider} from "react-redux";
import reducer from "./reducer";
import {devToolsEnhancer} from "redux-devtools-extension";
import {BrowserRouter} from "react-router-dom";

const store = createStore(reducer, devToolsEnhancer())

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
                <Toaster/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
