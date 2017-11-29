import * as authTypes from '../actions/auth'
const initialState = {
    user: null,
    loggingIn: false,
    loggingOut: false,
    loginError: null
};

export default function auth( state = initialState,action ){
    switch(action.type){
        case authTypes.LOGIN_PENDING:
            return Object.assign({},initialState,{loggingIn:false});

        case authTypes.LOGIN_SUCCESS:
            let user = action.payload.data;
            window.localStorage.setItem('uid',user.id);
            return Object.assign({},state,{user:user,loggingIn:false,loginError: null});

        case authTypes.LOGIN_ERROR:
            return {
                ...state,
                loggingIn: false,
                user: null,
                loginError: action.payload.response.data.message
            };

        case authTypes.LOGOUT_SUCCESS:
            window.localStorage.removeItem('uid')
            return {
                ...state,
                loggingOut: false,
                user: null,
                loginError: null
            }

        case authTypes.FETCH_PROFILE_SUCCESS:
            return Object.assign({},state,{user:action.payload.data,loggingIn: false,loginError: null})

        default:
            return state;
    }
}
