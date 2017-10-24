import * as operaTypes from '../actions/operation'

const initialState = {
    tables: null
}

export default function operation(state = initialState, action){
    switch(action.type){
        case operaTypes.OPERATION_ADD_PENDING:
            return Object.assign({},initialState,{tables:null})

        case operaTypes.OPERATION_ADD_SUCCESS:
            let tables = action.payload.data;
            return Object.assign({},state,{tables:tables})
        default:
            return state
    }
}