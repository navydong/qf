import { combineReducers } from 'redux';
import auth from './auth'
import * as type from '../actions/type';


const handleData = (state = {
    isFetching: true,
    data: {}
}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return { ...state,
                isFetching: true
            };
        case type.RECEIVE_DATA:
            return { ...state,
                isFetching: false,
                data: action.data
            };
        default:
            return { ...state
            };
    }
};
const httpData = (state = {}, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return { ...state
            };
    }
};


// function Ajax(url, cb) {
//     var xmlHttpReq = null;
//     if (window.ActiveXObject) {
//         // xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
//     } else if (window.XMLHttpRequest) {
//         xmlHttpReq = new XMLHttpRequest();
//     }
//     if (xmlHttpReq != null) {
//         xmlHttpReq.open("GET", url, true);
//         xmlHttpReq.onreadystatechange = RequestCallBack;
//         xmlHttpReq.send(null);
//     }

//     function RequestCallBack() {
//         if (xmlHttpReq.readyState === 4) {
//             if (xmlHttpReq.status === 200) {
//                 cb(JSON.parse(xmlHttpReq.responseText))
//             }
//         }
//     }
// }



const menu = (state = {}, action) => {
    switch (action.type) {
        case 'GET_MENU':
            return {
                ...state,
                menuList: action.data
            }
        default:
            return { ...state};
    }
}


export default combineReducers({
    httpData,
    auth,
    menu,
});