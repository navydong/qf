import axios from 'axios'
import Qs from 'qs'
import {
    message
} from 'antd'


// axios.defaults.headers.common['access-token'] = localStorage.getItem('token')
axios.defaults.paramsSerializer = function (params) {
    return Qs.stringify(params)
}
axios.defaults.transformRequest = [function (data) {
    return Qs.stringify(data)
}]
axios.defaults.withCredentials = true;
//创建一个axios实例
const ajax = axios.create({
    baseURL: 'http://192.168.103.199:8765',
    timeout: 1000,
});

/**
 * 公用get请求
 * @param url       接口地址(/back/user)
 * @param data      接口参数
 * @param msg       接口异常提示
 */
export const get = ({
    url,
    data = '',
    msg = "接口异常"
}) => ajax.get(url, {
    params: data
}).then(res => res.data).catch(err => {
    console.log(err)
    message.warn(msg)
})


/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({
    url,
    data,
    msg = "接口异常"
}) => ajax.post(url, data, msg = "接口异常").then(res => res.data).catch(err => {
    console.log(err)
    message.warn(msg)
})


/**
 * 公用delete请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 */
export const deletes = ({
    url,
    data,
    msg = "接口异常"
}) => ajax.delete(url, {
    params: data
}).then(res => res.data).catch(err => {
    console.log(err)
    message.warn(msg)
})


/**
 * 公用put方法
 * @param url       接口参数
 * @param data      接口参数
 * @param msg       接口异常提示
 */
export const put = ({
    url,
    data,
    msg = "接口异常"
}) => ajax.put(url, data).then(res => res.data).catch(err => {
    console.log(err)
    message.warn(msg)
})