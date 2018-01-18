import {
    combineReducers
} from 'redux';
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
        case 'GET_CURRENT':
            return {
                ...state,
                user: {
                    ...state.user,
                    data: {
                        ...state.user.data,
                        isInit: action.playload
                    }
                }
            }
        default:
            return { ...state
            };
    }
};

const currentUser = (state = {}, action) => {
    switch (action.type) {
        case 'GET_CURRENT':
            return {
                httpData: {
                    user: {
                        data: {
                            isInit: 1
                        }
                    }
                }
            }
    }
}

export default combineReducers({
    httpData
});