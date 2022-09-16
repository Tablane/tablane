import styles from '../styles/ErrorPage.module.scss'

function ErrorPage({ error }) {
    return (
        <div className={styles.container}>
            <p className={styles.title}>Something went wrong</p>
            <p>{JSON.stringify(error, null, 2)}</p>
        </div>
    )
}

export default ErrorPage
