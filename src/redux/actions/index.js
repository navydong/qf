import * as type from './type';
import * as http from '../../axios/index';
import axios from 'axios'

const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});

export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});

/**
 * 请求数据调用方法
 * @param funcName      请求接口的函数名
 * @param params        请求接口的参数
 */
export const fetchData = ({
    funcName,
    params,
    stateName
}) => dispatch => {
    !stateName && (stateName = funcName);
    dispatch(requestData(stateName));
    return http[funcName](params).then(res => dispatch(receiveData(res, stateName)));
};

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
function httpRequest(category, config){
    return (params) => dispatch => {
        dispatch(requestData(category))
        return axios(config).then(res=>{
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