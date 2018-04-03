import {
    combineReducers
} from 'redux';
import * as type from './type';

const InitialState = {
    cardInfo: {
        brand_name: '品牌名称',
        title: '卡卷名',
        color: 'Color010',
        code_type: 'CODE_TYPE_QRCODE',
        member_supply: ['1']
    }
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
        case 'CARDINFO':
            return {
                ...state,
                cardInfo: {
                    ...state.cardInfo,
                    ...action.payload
                }
            }
        default:
            return state;
    }
};





export default reducer