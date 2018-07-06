import {httpRequest} from '../../actions'

/**
 * 获取小程序列表
 * wxManager 
 * @export
 * @returns 
 */
export const getWxManager = httpRequest('wxManager', {
    method: 'GET',
    url: '/back/smallprogrammenu/list',
})
