import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { store } from './modules/state/store'
import { history } from './utils/history'
import { HistoryRouter } from './utils/history'
import posthog from 'posthog-js'

posthog.init(process.env.REACT_APP_POSTHOG_TOKEN, {
    api_host: 'https://eu.posthog.com'
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <HistoryRouter history={history}>
                <App />
                <Toaster />
            </HistoryRouter>
        </Provider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
