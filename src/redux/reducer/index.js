import { combineReducers } from 'redux';
import auth from './auth'
import categorys from './category'
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
const menu = (state = {}, action) => {
    switch (action.type) {
        case 'GET_MENU':
            return {
                ...state,
                menuList: action.data
            }
        default:
            return state;
    }
}


export default combineReducers({
    httpData,
    auth,
    menu,
    categorys,
});