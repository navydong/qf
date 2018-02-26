/**
 * 给多级嵌套数据设置key，并删除空的children
 * key = id
 * @param {*} data 
 */
export const setKey = function(data){
    for (var i = 0; i < data.length; i++) {
        data[i].key = data[i].id
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
    return data
}