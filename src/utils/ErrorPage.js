import styles from '../styles/ErrorPage.module.scss'
import { useSearchParams } from 'react-router-dom'

function ErrorPage(props) {
    const [searchParams] = useSearchParams()
    const error = props.error || { message: searchParams.get('error') } || {}
    return (
        <div className={styles.container}>
            <p className={styles.title}>Something went wrong</p>
            {error.status === 'FETCH_ERROR' ? (
                <p>Cannot connect to server</p>
            ) : (
                <p>{JSON.stringify(error, null, 2)}</p>
            )}
        </div>
    )
}

export default ErrorPage
