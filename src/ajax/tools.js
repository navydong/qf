import axios from 'axios'
import qs from 'qs'


// axios.defaults.headers.common['access-token'] = localStorage.getItem('token')
axios.defaults.paramsSerializer = function (params) {
    return qs.stringify(params)
}
axios.defaults.transformRequest = [function (data) {
    return qs.stringify(data)
}]
axios.defaults.auth = {
    username: 'admin',
    password: 'yss300377'
}

// axios.defaults.withCredentials = true;

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    console.log(response)
    //如果响应给了重新定向，这跳转到redirect的地址
    // const redirect = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:8765)?\/login$/i.test(response.request.responseURL)
    const redirect = /login$/i.test(response.request.responseURL)
    if (redirect) {
        // window.location.href = response.request.responseURL
    }
    return response;
});

export const axioscofig = axios

