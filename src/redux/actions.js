import * as type from './type';
// import * as http from '../../axios/index';
import axios from 'axios'


function requestData(category) {
    return {
        type: type.REQUEST_DATA,
        category
    }
}

function receiveData(data, category) {
    return {
        type: type.RECEIVE_DATA,
        data,
        category,
        receiveAt: Date.now()
    }
}


/**
 * 获取菜单
 * menu
 * @export
 * @returns 
 */
export const getMenu = () => dispatch => {
    dispatch(requestData('menu'))
    return axios.get('/back/menu/system').then((res) => {
        dispatch(receiveData(res.data, 'menu'))
    })
}


/**
 * 获取用户
 * users
 * @export
 * @returns 
 */
// export const getUsers = (params) => dispatch => {
//     dispatch(requestData('users'))
//     return axios.get('/back/user/page', {
//         params
//     }).then((res) => {
//         dispatch(receiveData(res.data, 'users'))
//     })
// }


/**
 * 获取小程序列表
 * wxManager 
 * @export
 * @returns 
 */
export const getWxManager = httpRequest('wxManager', {
    method: 'GET',
    url: '/back/smallprogrammenu/list'
})

/**
 * 生成http请求action
 * 
 * @param {any} category 数据名
 * @param {any} config   axios配置
 * @returns 
 */
export function httpRequest(category, config) {
    return (params) => (dispatch, getState) => {
        console.log(params)
        dispatch(requestData(category))
        if(config.method.toUpperCase() === 'GET'){
            config.params = params
        }else{
            config.data = params
        }
        console.log(config)
        return axios(config).then(res => {
            dispatch(receiveData(res.data, category))
        })
    }
}

/**
 * 获取角色
 */
export const getGroup = httpRequest('group', {
    method: 'get',
    url: '/back/group/tree/list',
})

// export const getCurrentUser = httpRequest('user', {
//     method: 'get',
//     ur: '/back/user/resetPassword'
// })
/**
 * 获取当前登录用户信息
 * @param {*} params 
 */
export const getCurrentUser = (params) => dispatch => {
    const category = 'userInfo';
    dispatch(requestData(category))
    return axios.get('/back/user', {
        params
    }).then((res) => {
        dispatch(receiveData(res.data, category))
    })
}