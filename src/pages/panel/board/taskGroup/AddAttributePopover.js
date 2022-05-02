import '../../../../components/assets/AddAttributePopover.css'
import axios from "axios";
import {toast} from "react-hot-toast";
import {Popover} from "@material-ui/core";

function AddAttributePopover(props) {

    const handleClose = () => {
        props.close()
    };

    const handleNewColumn = async (type) => {
        handleClose()
        if (type !== 'status' && type !== 'text') {
            toast('Coming soon')
            return
        }

        await axios({
            method: 'POST',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/attribute/${props.boardId}`,
            data: {
                type
            }
        }).then(() => {
            props.getData()
        }).catch(err => {
            toast(err.toString())
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