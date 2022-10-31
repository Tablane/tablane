import { Popover } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useEffect, useRef, useState } from 'react'
import LinkIcon from '../../../../../../styles/assets/LinkIcon'

function CommentPopover() {
    const [open, setOpen] = useState(null)
    const lastEl = useRef()

    const items = [
        {
            name: 'Copy URL',
            icon: <LinkIcon className="h-4" />
        },
        {
            name: 'Delete',
            icon: (
                <FontAwesomeIcon
                    icon={regular('trash-alt')}
                    className="text-pink-400"
                />
            )
        }
    ]

    useEffect(() => {
        if (open) {
            open.parentNode.parentNode.dataset.active = Boolean(open)
            lastEl.current = open
        } else if (lastEl.current)
            lastEl.current.parentNode.parentNode.dataset.active = Boolean(open)
    }, [open])

    return (
        <>
            <div onClick={e => setOpen(e.currentTarget)}>
                <FontAwesomeIcon icon={solid('ellipsis')} />
            </div>
            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <div className="py-2">
                    {items.map(item => (
                        <div className="h-8" key={item.name}>
                            <div className="w-40 h-8 p-2 rounded-md mx-2 flex flex-row content-center hover:bg-gray-100 cursor-pointer">
                                <div className="w-4 mr-2 flex content-center justify-center">
                                    {item.icon}
                                </div>
                                <p className="text-sm leading-2">{item.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Popover>
        </>
    )
}

export default CommentPopover
