import {Popover} from "@material-ui/core";
import styles from '../../../styles/GroupByPopover.module.scss'
import {useSelector} from "react-redux";

function GroupByPopover({ groupByOpen, setGroupByOpen }) {
    const { board } = useSelector(state => state.board)

    const handleClose = () => {
        setGroupByOpen(null)
    }

    const handleGroupByChange = () => {

    }

    return (
        <Popover
            classes={{
                paper: styles.popover,
            }}
            id={'groupBySelector'}
            open={Boolean(groupByOpen)}
            anchorEl={groupByOpen}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <div className={styles.root}>
                <div className={styles.title}>
                    <span>Group by</span>
                </div>
                <div className={styles.statusList}>
                    {board?.attributes.map(attribute => {
                        if (!['status'].includes(attribute.type)) return
                        return (
                            <div
                                className={styles.status}
                                key={attribute._id}
                                onClick={() => handleGroupByChange()}>
                                <span>{attribute.name}</span>
                            </div>
                        )
                    })}
                    <div className={styles.status} onClick={() => handleGroupByChange()}>
                        <span>None</span>
                    </div>
                </div>
            </div>
        </Popover>
    )
}

export default GroupByPopover