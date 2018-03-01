import {
    combineReducers
} from 'redux';
import * as type from './type';

const InitialState = {
    
}

const handleData = (state = {
    isFetching: true,
    data: []
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
            return state;
    }
};

const reducer = (state = InitialState, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
        case type.RECEIVE_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return state;
    }
};


export default reducer