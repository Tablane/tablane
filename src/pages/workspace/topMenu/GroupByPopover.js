import { Popover } from '@mui/material'
import styles from '../../../styles/GroupByPopover.module.scss'
import { useSetGroupByMutation } from '../../../modules/services/boardSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import React from 'react'

function GroupByPopover({ board, groupByOpen, setGroupByOpen }) {
    const [setGroupBy] = useSetGroupByMutation()

    const handleClose = () => {
        setGroupByOpen(null)
    }

    const handleGroupByChange = _id => {
        setGroupBy({ boardId: board._id, groupBy: _id })
        handleClose()
    }

    return (
        <Popover
            classes={{
                paper: styles.popover
            }}
            id={'groupBySelector'}
            open={Boolean(groupByOpen)}
            anchorEl={groupByOpen}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
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
                                onClick={() =>
                                    handleGroupByChange(attribute._id)
                                }
                            >
                                <span>{attribute.name}</span>
                                {board?.groupBy === attribute._id && (
                                    <FontAwesomeIcon icon={solid('check')} />
                                )}
                            </div>
                        )
                    })}
                    <div
                        className={styles.status}
                        onClick={() => handleGroupByChange('none')}
                    >
                        <span>None</span>
                        {(!board?.groupBy || board?.groupBy === 'none') && (
                            <FontAwesomeIcon icon={solid('check')} />
                        )}
                    </div>
                </div>
            </div>
        </Popover>
    )
}

export default GroupByPopover
