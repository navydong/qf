import * as type from './type';
// import * as http from '../../axios/index';
import axios from 'axios'

/**
 * 开始请求数据，正在异步操作状态
 *  
 * @param {*} category 
 */
const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});

/**
 * 请求数据结束，异步操作结束
 * 
 * @param {any} data  返回的数据
 * @param {any} category  数据名
 */
const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});


/**
 * 获取菜单
 * menu
 * @export
 * @returns 
 */
export const getMenu = () => dispatch => {
    dispatch(requestData('menu'))
    return axios.get('/back/menu/system').then((res) => {
        const data = res.data
        dispatch(receiveData(data, 'menu'))
    })
}


/**
 * 获取用户
 * users
 * @export
 * @returns 
 */
export const getUsers = (params) => dispatch => {
    dispatch(requestData('users'))
    return axios.get('/back/user/page', {
        params
    }).then((res) => {
        const data = res.data
        dispatch(receiveData(data, 'users'))
    })
}

/**
 * 生成http请求action
 * 
 * @param {any} category 数据名
 * @param {any} config   axios配置
 * @returns 
 */
function httpRequest(category, config) {
    return (params) => (dispatch, getState) => {
        dispatch(requestData(category))
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