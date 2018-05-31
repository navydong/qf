/**
 * 格式成Cascader组件所需格式
 * @param {*} res 
 */
function formCascaderData(res, label, disableId) {
    (function d(s) {
        s.forEach(item => {
            item.value = item.id
            item.label = item[label]
            if (item.id === disableId) {
                debugger
                // item.disabled = true
            }
            if (item.children) {
                d(item.children)
            }
        })
    })(res)
    return setKey(res)
}

const setKey = function (data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
    return data
}

module.exports = formCascaderData