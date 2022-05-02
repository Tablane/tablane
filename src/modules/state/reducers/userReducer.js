import axios from "axios";
import {toast} from "react-hot-toast";

const reducer = (state = null, action) => {
    switch (action.type) {
        case 'userLogin':
            return (
                {
                    "workspaces": [
                        { "_id": "6263b7005714aad5b7a805a6", "id": 5795, "name": "game" }
                    ],
                    "_id": "6263b6fb5714aad5b7a805a0",
                    "username": "game",
                    "email": "game@engine.net",
                    "__v": 1
                }
            )
        case 'userLogout':
            return null
        default:
            return state
    }
}

export default reducer