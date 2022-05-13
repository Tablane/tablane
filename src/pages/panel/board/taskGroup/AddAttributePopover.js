import '../../../../styles/AddAttributePopover.css'
import {toast} from "react-hot-toast";
import {Popover} from "@material-ui/core";
import { ObjectId } from "../../../../utils";
import { addAttribute } from "../../../../modules/state/reducers/boardReducer";
import { useDispatch } from "react-redux";

function AddAttributePopover(props) {
    const dispatch = useDispatch()

    const handleClose = () => {
        props.close()
    };

    const handleNewColumn = async (type) => {
        handleClose()
        if (type !== 'status' && type !== 'text') {
            toast('Coming soon')
            return
        }
        dispatch(addAttribute({
            type,
            _id: ObjectId()
        }))
    }

    return (
        <Popover
            className="AddAttributePopover"
            open={Boolean(props.anchor)}
            anchorEl={props.anchor}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <div className="content">
                <div>
                    <p>Essentials</p>
                    <div>
                        <div>
                            <div onClick={() => handleNewColumn('status')}><i className="fas fa-bars"> </i>Status</div>
                            <div onClick={() => handleNewColumn('text')}><i className="fas fa-font"> </i>Text</div>
                            <div onClick={() => handleNewColumn('people')}><i className="far fa-user-circle"> </i>People</div>
                        </div>
                        <div>
                            <div onClick={() => handleNewColumn('dropdown')}><i className="fas fa-tag"> </i>Dropdown</div>
                            <div onClick={() => handleNewColumn('date')}><i className="far fa-calendar"> </i>Date</div>
                            <div onClick={() => handleNewColumn('number')}><i className="fas fa-hashtag"> </i>Numbers</div>
                        </div>
                    </div>
                </div>
            </div>
        </Popover>
    );
}

export default AddAttributePopover