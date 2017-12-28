import axios from 'axios'
import qs from 'qs'
import {
    message
} from 'antd'


// axios.defaults.headers.common['access-token'] = localStorage.getItem('token')
axios.defaults.paramsSerializer = function (params) {
    return qs.stringify(params)
}
axios.defaults.transformRequest = [function (data) {
    return qs.stringify(data)
}]

// axios.defaults.withCredentials = true;

//创建一个axios实例
const httpInstance = axios.create({
    // baseURL: '',
    timeout: 1000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
});
export const axioscofig = axios


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    //如果响应给了重新定向，这跳转到redirect的地址
    // const redirect = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:8765)?\/login$/i.test(response.request.responseURL)
    const redirect = /login$/i.test(response.request.responseURL)
    if (redirect) {
        window.location.href = response.request.responseURL
    }
    return response;
});



export const http = {
    get: (url, params) => {
        return httpInstance({
            url,
            method: 'get',
            params,
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        })
    },
    post: (url, params) => {
        return httpInstance({
            url,
            method: 'post',
            data: qs.stringify(params),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        })
    },
    put: (url, params) => {
        return httpInstance({
            url,
            method: 'put',
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        })
    },
    delete: (url, params) => {
        return httpInstance({
            url,
            method: 'delete'
        }).then(response => {
            return checkStatus(response)
        }).then(response => {
            return checkCode(response)
        })
    }
}

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
    if (!res.rel) {
        message.error(res.msg, 10)
    }
    return res
}