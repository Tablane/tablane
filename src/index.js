import React, { useEffect } from 'react'
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
import {
    useLocation,
    useNavigationType,
    createRoutesFromChildren,
    matchRoutes
} from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

posthog.init(process.env.REACT_APP_POSTHOG_TOKEN, {
    api_host: 'https://eu.posthog.com'
})
Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
        new BrowserTracing({
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes
            )
        }),
        new posthog.SentryIntegration(
            posthog,
            'tablane',
            process.env.REACT_APP_SENTRY_PROJECT_ID
        )
    ],
    tracesSampleRate: 1.0,
    enabled: process.env.NODE_ENV !== 'development'
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
