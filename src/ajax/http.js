import axios from 'axios'
import qs from 'qs'
import {
    message,
    notification
} from 'antd'


//创建一个axios实例
const httpInstance = axios.create({
    baseURL: '/back',
    timeout: 10000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

/**
 * 检查http状态码
 * 
 * @param {any} response 
 * @returns 
 */
function checkStatus(response) {
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response.data
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        rel: false,
        msg: '网络异常'
    }
}
/**
 * 检查返回对象的rel
 * 
 * @param {any} res 
 * @returns 
 */
function checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    //判断是否有rel
    if (res.hasOwnProperty('rel')) {
        if (!res.rel) {
            message.error(res.msg, 10)
        }
    };

    return res
}

export const http = {
    /**
     * get 请求
     * 
     * @param {any} url 
     * @param {any} params 
     * @returns promise
     */
    get: (url, config) => {
        return httpInstance({
            url,
            method: 'get',
            config,
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        }).catch(err => {
            notification.open({
                message: `url: ${url}`,
                description: err.message
            })
        })
    },
    /**
     * post 请求
     * 
     * @param {any} url 
     * @param {any} data 
     * @returns promise
     */
    post: (url, data) => {

        return httpInstance({
            url,
            method: 'post',
            data: qs.stringify(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        }).catch(err => {
            notification.open({
                message: err.message,
                description: err.stack
            })
        })
    },
    /**
     * put 请求 
     * 
     * @example http.put(url, data)
     * @param {any} url 
     * @param {any} data 
     * @returns 
     */
    put: (url, data) => {
        return httpInstance({
            url,
            method: 'put',
            data: qs.stringify(data),
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        }).catch(err => {
            notification.open({
                message: err.message,
                description: err.stack
            })
        })
    },
    /**
     * 
     * 
     * @param {any} url 
     * @param {any} data 
     * @returns 
     */
    delete: (url, data) => {
        return httpInstance({
            url,
            method: 'delete',
            data: qs.stringify(data)
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        }).catch(err => {
            notification.open({
                message: err.message,
                description: err.stack
            })
        })
    }
}

export default http