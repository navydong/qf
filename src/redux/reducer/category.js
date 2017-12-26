const initialState = {}

export default function categorys(state = initialState, action) {
    switch (action.type) {
        case 'GET_CATEGORY_LIST':
            //console.log(action)
            return Object.assign({}, state, {
                data: action.data
            })
        default:
            return state
    }
}