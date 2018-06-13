/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-01 16:40:54 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-06-11 10:51:29
 */

import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// GET请求参数params转化
// axios.defaults.paramsSerializer = function (params) {
//     console.log(params)
//     return qs.stringify(params)
// }


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// POST请求参数转化, 采用formdata格式提交 非json
axios.defaults.transformRequest = [function (data) {
    if (data instanceof FormData) {
        return data
    }
    return qs.stringify(data)
}]

if (process.env.NODE_ENV !== 'production') {
    axios.defaults.auth = {
        username: 'admin',
        password: 'yss300377',
        // username: 'qf1',
        // password: '1'
    }
}


// axios.defaults.withCredentials = true;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 请求开始进度条开始
    NProgress.start()
    return config;
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 请求结束进度条开始
    NProgress.done()
    //如果响应给了重新定向，这跳转到redirect的地址
    const redirect = /login$/i.test(response.request.responseURL)
    if (redirect) {
        window.location.href = response.request.responseURL
    }
    return response;
}, function (response) {
    const logUrl = '/back/log'
    const {
        url,
        data,
        params
    } = response.config
    if (url == logUrl) return
    var config = {
        url,
        data,
        params,
        responseText: response.request.responseText,
        stack: response.stack,
        message: response.message
    }
    // axios.post(logUrl, config)
});

export const axioscofig = axios