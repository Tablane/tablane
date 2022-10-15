import { createBrowserHistory } from 'history'
import { useLayoutEffect, useState } from 'react'
import { Router } from 'react-router-dom'

export const history = createBrowserHistory()

export function HistoryRouter({ basename, children, history }) {
    let [state, setState] = useState({
        action: history.action,
        location: history.location
    })

    useLayoutEffect(() => history.listen(setState), [history])

    return (
        <Router
            basename={basename}
            children={children}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        />
    )
}
