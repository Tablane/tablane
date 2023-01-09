import { CircularProgress } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { brands, solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function LoadingPage() {
    return (
        <div className="flex justify-center items-center h-[100vh] w-full flex-col">
            <CircularProgress />
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
