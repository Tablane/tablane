import styles from '../styles/ErrorPage.module.scss'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { brands, solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function ErrorPage(props) {
    const [searchParams] = useSearchParams()
    const error = props.error || { message: searchParams.get('error') } || {}
    return (
        <div className={styles.container}>
            <p className={styles.title}>Something went wrong</p>
            {error.status === 'FETCH_ERROR' ? (
                <p className="m-4">Cannot connect to server</p>
            ) : (
                <p className="m-4">{JSON.stringify(error, null, 2)}</p>
            )}
            <div className="text-center absolute bottom-[30px] text-sm">
                <p>Connection problems? Let us know!</p>
                <div className="text-[#00AFF4] font-lg mt-1">
                    <a
                        className="mx-4"
                        target="_blank"
                        href="https://twitter.com/tablane_net"
                    >
                        <FontAwesomeIcon
                            className="mr-2"
                            icon={brands('twitter')}
                        />
                        Tweet Us
                    </a>
                    <a
                        className="mx-4"
                        target="_blank"
                        href="https://status.tablane.net"
                    >
                        <FontAwesomeIcon
                            className="mr-2"
                            icon={solid('globe')}
                        />
                        Server Status
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage
