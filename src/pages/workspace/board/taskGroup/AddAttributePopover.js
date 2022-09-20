import '../../../../styles/AddAttributePopover.css'
import { toast } from 'react-hot-toast'
import { Popover } from '@mui/material'
import { ObjectId } from '../../../../utils'
import { useAddAttributeMutation } from '../../../../modules/services/boardSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro'

function AddAttributePopover(props) {
    const [addAttribute] = useAddAttributeMutation()

    const handleClose = () => {
        props.close()
    }

    const handleNewColumn = async type => {
        handleClose()
        if (!['status', 'text', 'people'].includes(type)) {
            toast('Coming soon')
            return
        }
        addAttribute({
            boardId: props.boardId,
            type,
            _id: ObjectId()
        })
    }

    return (
        <Popover
            className="AddAttributePopover"
            open={Boolean(props.anchor)}
            anchorEl={props.anchor}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
        >
            <div className="content">
                <div>
                    <p>Essentials</p>
                    <div>
                        <div>
                            <div onClick={() => handleNewColumn('status')}>
                                <FontAwesomeIcon icon={solid('bars')} />
                                Status
                            </div>
                            <div onClick={() => handleNewColumn('text')}>
                                <FontAwesomeIcon icon={solid('font')} />
                                Text
                            </div>
                            <div onClick={() => handleNewColumn('people')}>
                                <FontAwesomeIcon
                                    icon={regular('user-circle')}
                                />
                                People
                            </div>
                        </div>
                        <div>
                            <div onClick={() => handleNewColumn('dropdown')}>
                                <FontAwesomeIcon icon={solid('tag')} />
                                Dropdown
                            </div>
                            <div onClick={() => handleNewColumn('date')}>
                                <FontAwesomeIcon icon={regular('calendar')} />
                                Date
                            </div>
                            <div onClick={() => handleNewColumn('number')}>
                                <FontAwesomeIcon icon={solid('hashtag')} />
                                Numbers
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Popover>
    )
}

export default AddAttributePopover
