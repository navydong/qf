/**
 * 给多级嵌套数据设置key，并删除空的children
 * key = id
 * @param {*} data 
 */
export const setKey = function (data, useFunc) {
    for (var i = 0; i < data.length; i++) {
        // if (data[i] == undefined) break
        //中间处理函数
        useFunc && useFunc(data[i])
        data[i].key = data[i].id
        if (!data[i].children) {
            console.error('data.chilren is not exits')
            return data
        }
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
    return data
}