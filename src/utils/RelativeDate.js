import styles from '../styles/RelativeDate.module.scss'
import {useEffect, useState} from "react";

function Dates(props) {
    const [time, setTime] = useState(Date.now());

    const getTime = (timestamp) => {
        const delta = Math.round((+new Date() - new Date(timestamp)) / 1000)

        const minute = 60,
            hour = minute * 60,
            day = hour * 24

        let timeString = '';

        if (delta < 60) {
            timeString = 'Just now';
        } else if (delta < 2 * minute) {
            timeString = '1 min'
        } else if (delta < hour) {
            timeString = Math.floor(delta / minute) + ' mins';
        } else if (Math.floor(delta / hour) === 1) {
            timeString = '1 hour ago'
        } else if (delta < day) {
            timeString = Math.floor(delta / hour) + ' hours ago';
        } else if (delta < day * 2) {
            timeString = 'yesterday';
        } else if (delta < day * 7) {
            timeString = Math.floor(delta / day) + ' days ago';
        } else {
            const date = new Date(timestamp)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            timeString = `${months[date.getMonth()]} ${date.getDay()} ${date.getFullYear()} `
                + `at ${date.toLocaleTimeString().substring(0, 5)}`
        }

        return timeString
    }

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 60000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <span className={styles.date}>{getTime(props.timestamp)}</span>
    )
}

export default Dates