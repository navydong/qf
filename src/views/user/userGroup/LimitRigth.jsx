import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Table, message, Modal, notification } from 'antd'


class MenuRight extends Component {
    state = {
        loading: true, //表格是否加载中
        data: [],
        selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
        selectedRows: [], //选中行的具体信息
        authorityId: '' //用户组id
    }
    componentDidMount() {
        this.getPageList()
        console.log(document.querySelector('.menuRigth .ant-table-selection-column .ant-checkbox-input'))
        window.document.querySelector('.menuRigth .ant-table-selection-column .ant-checkbox-inner').style.display = 'none';
    }
    /**
     * 
     * @param {String} menuId 左侧菜单项id
     * @param {String} authorityId 用户组id
     */
    getPageList(menuId,authorityId) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        this.setState({
            authorityId
        })
        axios.get(`/back/group/element/authority/${menuId}`).then(({ data }) => {
            if (data.rel) {
                console.log(data)
                data.result.forEach((item, index) => {
                    item.key = `${item.id}`
                })
                this.setState({
                    total: data.length,
                    data: data.result,
                    loading: false,
                    menuId
                })
            }
        }).catch((err) => {
            console.log(err)
        })
        axios.get(`/back/group/element/authority?resourceId=${menuId}&authorityId=${authorityId}`).then(res => res.data).then(res => {
            console.log(res)
            this.setState({
                selectedRowKeys: res.authority
            })
        })
    }

    /**
     * 处理表格的选择事件
     * 
     * @param selectedRowKeys
     */
    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };
    userSelect = (record, selected, selectedRows) => {
        const id = this.state.authorityId
        if(selected){ //增加add
            axios.post(`/back/group/${id}/authority/element/add`,{
                menuId: record.menuId,
                elementId: record.id
            }).catch(err=>{
                message.warn(err.message)
            })
        }else{ //删除 remove
            axios.post(`/back/group/${id}/authority/element/remove`,{
                menuId: record.menuId,
                elementId: record.id
            }).catch(err=>{
                message.warn(err.message)
            })
        }
    }
    selectAll = (selected, selectedRows, changeRows) => {

    }
    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
            onSelect: this.userSelect,
            onSelectAll: this.selectAll,
        };
        //表格表头信息
        const columns = [{
            title: "按钮",
            dataIndex: "name",
        }, {
            title: "权限编码",
            dataIndex: "code",
        }, {
            title: "资源路径",
            dataIndex: "uri",
        }, {
            title: "方式",
            dataIndex: "method"
        }]
        return (
            <div className="menuRigth">
                <Card style={{ marginTop: 8 }}>
                    <Row>
                        <Col>
                            <Table
                                bordered
                                loading={this.state.loading}
                                columns={columns}
                                dataSource={this.state.data}
                                rowSelection={rowSelection}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}



export default MenuRight