/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-01 16:40:54 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-04-18 10:40:37
 */

import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.paramsSerializer = function (params) {
    return qs.stringify(params)
}
axios.defaults.transformRequest = [function (data) {
    return qs.stringify(data)
}]

if (process.env.NODE_ENV !== 'production') {
    axios.defaults.auth = {
        username: 'admin',
        password: 'yss300377',
        // username: 'lzksh',
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
});

export const axioscofig = axios