import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Input, Button, Select, Table, message, Modal, notification, Tabs } from 'antd'
import AddModal from './AddModal'
import SearchBox from './SearchBox'
import AddUserModal1 from './AddUserModal'
import LimitModal from './LimitModal'
import './user.less'



// 给数据增加key值，key=id
function setKey(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i]) {
            data[i].key = data[i].id
        }
        // if (data[i].children.length > 0) {
        //     setKey(data[i].children)
        // } else {
        //     //删除最后一级的children属性
        //     delete data[i].children
        // }
    }
}
//每页请求条数 
const defaultPageSize = 10;
class Content extends Component {
    state = {
        loading: true, //表格是否加载中
        data: [],
        total: '',
        current: 1,
        visible: false,
        userModalVisible: false, // 用户添加窗口是否显示
        selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
        selectedRows: [], //选中行的具体信息
        item: {},
        isAddMoadl: true,
        limitModalVisible: false,
        confirmLoading: false,  //权限确认按钮的loading
    }
    componentDidMount() {
        this.getPageList()
    }
    /**
     * 
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {String} name 通道名称
     */
    getPageList(limit = 10, offset = 1, name) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/group/tree/list',{
            params: {
                limit,
                offset,
                name,
            }
        }).then(({ data }) => {
            data.rows.forEach((item) => {
                item.key = item.id
            })
            this.setState({
                total: data.total,
                data: data.rows,
                current: offset,
                loading: false,
            })
        })
    }
    /**
     * 表格树形数据展示dataSource处理
     * @param {Object} data 
     */
    formDataSource(tableData) {
        for (var i = 0; i < tableData.length; i++) {

        }
    }
    /**
     * 点击删除按钮, 弹出一个确认对话框
     * @param e
     */
    onClickDelete = (e) => {
        e.preventDefault();
        Modal.confirm({
            title: this.state.selectedRowKeys.length > 1 ? '确认批量删除' : '确认删除',
            // 这里注意要用箭头函数, 否则this不生效
            onOk: () => {
                axios.all(this.state.selectedRows.map((item) => {
                    console.log(item)
                    return axios.delete(`/back/group/${item.id}`)
                })).then(axios.spread((acct, perms) => {
                    if (!acct.data.rel) {
                        message.error(acct.data.msg)
                        return
                    }
                    message.success('删除成功')
                    this.getPageList()
                    //this.handleDelete();
                })).catch((err) => {
                    notification.open({
                        message: "删除失败",
                        description: err.message
                    })
                })

            },
        });
    }
    /**
     * 删除数据，更新表格
     * @param keys:Array  选中行的key
     */
    handleDelete(keys = this.state.selectedRowKeys) {
        let data = this.state.data.slice()
        for (let i = 0, len = data.length; i < len; i++) {
            for (let j = 0; j < keys.length; j++) {
                if (data[i] && data[i].key === keys[j]) {
                    data.splice(i, 1);
                    i--;
                }
            }
        }
        this.setState({
            data: data,
            selectedRowKeys: []
        })
    }
    //增加按钮
    addHandle = () => {
        this.setState({
            item: {},
            visible: true,
            isAddMoadl: true
        })
    }
    /**
     * 模态框提交按钮--增加
     * @param values
     */
    handleOk = (values) => {
        console.log('Received values of form: ', values);
        const id = this.state.item.id
        const parentId = this.state.selectedRows[0] ? this.state.selectedRows[0].id : -1
        if (this.state.isAddMoadl) {
            axios.post(`/back/group`, { ...values, parentId })
                .then(({ data }) => {
                    if (data.rel) {
                        message.success('添加成功！')
                        this.getPageList();
                        // let newData = this.state.data.slice()
                        // newData.unshift({
                        //     key: Date.now().toString(),
                        //     passwayName: values.passwayName,
                        // })
                        // this.setState({
                        //     data: newData
                        // })
                    } else {
                        message.error(data.msg)
                    }
                }).catch((err) => {
                    notification.open({
                        message: '添加失败',
                        description: err.message,
                        // style: {
                        //     backgroundColor: 'white',
                        //     color: '#000'
                        // }
                    });
                })
        } else {
            axios.put(`/back/group/${id}`, values).then((res) => {
                if (res.data.rel) {
                    message.success('修改成功')
                    this.getPageList()
                } else {
                    message.error(res.data.msg)
                }
            })
        }
        this.setState({
            visible: false,
        });
        // 清空表单
        this.refs.addModal.resetFields()
    }
    /**
     * 模态框取消按钮
     */
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    /**
     * 处理表格的选择事件
     * 
     * @param selectedRowKeys
     */
    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
        this.LimitModal.getPageList(selectedRowKeys[0])
    };
    /**
     * 下拉按钮组件
     */
    handleMenuClick = (record, e) => {
        if (e.key === '1') {
            //详细按钮
            this.setState({
                item: record,
                visible: true,
            })
        } else if (e.key === '2') {
            //更新按钮
            this.setState({
                item: record,
                visible: true,
                isAddMoadl: false
            })
        }
    }
    /**
     * 页码改变的回调，参数是改变后的页码及每页条数
     * @param page 改变后的页码
     * @param pageSize 改变页的条数
     */
    pageChange = (page, pageSize) => {
        this.getPageList(10, page)
    }
    /**
     * pageSize 变化的回调
     * @param current 当前页码
     * @param pageSize 改变后每页条数
     */
    onShowSizeChange = (current, pageSize) => {
        this.getPageList(pageSize, current)
    }
    /**
     * 查询功能
     * @param values 
     */
    search = (values) => {
        this.getPageList(10, 1, values.name)
    }
    /**
     * 左侧菜单编辑
     * @param text 当前行的数据
     */
    itmeEdit = (text) => {
        console.log(text)
        this.setState({
            item: text,
            visible: true,
            isAddMoadl: false
        })
    }
    /**
     * 增加用户按钮
     */
    addUser = () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.warn('请选择一行')
            return
        }
        this.setState({
            userModalVisible: true
        })
        message.destroy()
    }
    /**
     * 保存用户
     * @param {*} targetKeys 右侧别表keys
     * @param {*} sourceKeys 左侧列表keys
     */
    saveUser = (targetKeys,sourceKeys) => {
        this.getTarget(targetKeys, sourceKeys)
        //axios.put(`back/group/${this.state.selectedRowKeys[0]}/user`)
    }
    /**
     * 关闭添加用户对话框
     */
    cancelUser = () => {
        this.setState({
            userModalVisible: false
        })
    }
    //保存用户添加
    getTarget = (targetKeys, sourceKeys) => {
        const id = this.state.selectedRows[0].id
        const members = targetKeys.join(',')
        const leaders = sourceKeys.join(',')
        axios.put(`/back/group/${id}/user`, { members, leaders }).then(res => res.data).then(response => {
            if (response.rel) {
                this.setState({
                    userModalVisible: false
                })
                message.success('保存成功')
            }
        })
    }
    /***********权限功能块**********/
    //权限按钮
    limitButton = () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.warn('请选择一行')
            return
        }
        this.setState({
            limitModalVisible: true
        })
    }
    //权限模态框确认按钮
    limitOnOk = (leftSelectId) => {
        this.setState({
            confirmLoading: true,
        })
        const id = this.state.selectedRowKeys[0]
        axios.post(`/back/group/${id}/authority/menu`, {
            menuTrees: leftSelectId.join(',')
        }).then(res => res.data).then(res => {
            if (res.rel) {
                message.info('保存成功')
                this.setState({
                    confirmLoading: false,
                })
            }
        }).catch(err => {
            message.warn(err.message)
        })
        this.setState({
            limitModalVisible: false
        })
    }
    //权限模态框取消按钮 
    limitOnCancel = () => {
        this.setState({
            limitModalVisible: false
        })
    }
    /********************************/
    render() {
        //选择功能的配置。
        const rowSelection = {
            type: "radio",
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        //分页配置
        const pagination = {
            defaultPageSize,
            current: this.state.current,
            total: this.state.total,
            onChange: this.pageChange,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            showTotal: (total, range) => `共${total}条数据`,
            showQuickJumper: true
        }
        //表格表头信息
        const columns = [{
            title: "名称",
            dataIndex: "name",
            // width: 200
        }, {
            title: "描述",
            dataIndex: "description",
        }, {
            title: "操作",
            width: 80,
            render: (text, record, index) => {
                if (record.attr2 === 'true') {
                    return <Button icon="edit" title="修改" disabled></Button>
                } else {
                    return <Button icon="edit" title="修改" onClick={() => { this.itmeEdit(text, record, index) }} />
                }
            }
        }]
        return (
            <div className="usergroup-content">
                <div>
                    <Card bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                        <SearchBox loading={this.state.loading} search={this.search} />
                    </Card>
                    <Row gutter={10}>
                        <Col span={24}>
                            <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                                <Row gutter={10} style={{ marginBottom: 20 }}>
                                    <Col span={24} style={{ marginLeft: 14 }}>
                                        <Button
                                            title="添加角色"
                                            className="btn-add"
                                            size="large"
                                            shape="circle"
                                            type="primary"
                                            icon="plus"
                                            onClick={this.addHandle}
                                        />
                                        <Button
                                            title="删除"
                                            className="btn-delete"
                                            type="primary"
                                            size="large"
                                            shape="circle"
                                            icon="delete"
                                            disabled={!hasSelected}
                                            onClick={this.onClickDelete}
                                        />
                                        <Button
                                            title="添加用户"
                                            className="btn-add-user"
                                            type="primary"
                                            size="large"
                                            shape="circle"
                                            icon="user-add"
                                            onClick={this.addUser}
                                        />
                                        <Button
                                            title="权限管理"
                                            className="btn-limit"
                                            type="primary"
                                            size="large"
                                            shape="circle"
                                            icon="lock"
                                            onClick={this.limitButton}
                                        />
                                        <LimitModal
                                            visible={this.state.limitModalVisible}
                                            authorityId={this.state.selectedRowKeys[0]}
                                            onOk={this.limitOnOk}
                                            onCancel={this.limitOnCancel}
                                            confirmLoading={this.state.confirmLoading}
                                            ref={e => this.LimitModal = e}
                                        />
                                        <AddUserModal1
                                            visible={this.state.userModalVisible}
                                            onOk={this.saveUser}
                                            onCancel={this.cancelUser}
                                            parentId={this.state.selectedRows.length ? this.state.selectedRows[0].id : null}
                                            getTarget={this.getTarget}
                                        />
                                        <AddModal ref="addModal" onOk={this.handleOk}
                                            modalProps={{
                                                title: this.state.isAddMoadl ? "新增-角色" : "修改-角色",
                                                okText: "提交",
                                                item: this.state.item,
                                                wrapClassName: "vertical-center-modal",
                                                visible: this.state.visible,
                                                onCancel: this.handleCancel
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Table
                                            loading={this.state.loading}
                                            columns={columns}
                                            dataSource={this.state.data}
                                            rowSelection={rowSelection}
                                            pagination={pagination}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
export default Content

const ids = ["11d800e10be64c31ad799baea376bb32", "2114a45ee03f4bb7a48a6939ad009060", "36ecb27d96304073b148a117534717e0"]