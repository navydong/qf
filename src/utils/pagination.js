/**
 * @author donghaijun <donghaijun@ysstech.com>
 * 分页
 * @param self 
 * @param callback  页码改变后的回调
 * @returns 分页对象 http://2x.ant.design/components/pagination-cn/#header
 */

const paginat = function (self, callback) {
    const pageChange = (page, pageSize) => {
        self.setState({
            pageSize: pageSize,
            current: page
        }, function () {
            const {
                pageSize,
                current,
                searchParams
            } = self.state
            callback(pageSize, current, searchParams)
        })
    }
    return {
        current: self.state.current,
        total: self.state.total,
        onChange: pageChange,
        showSizeChanger: true,
        onShowSizeChange: pageChange,
        showTotal: (total, range) => `共${total}条数据`,
        showQuickJumper: true
    }
}

export {
    paginat
}