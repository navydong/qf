import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Button, Table, message, Modal, notification } from 'antd'
import { connect } from 'react-redux'

import { getWxManager } from '@/redux/actions/wxManager'
import AddModal from './AddModal'
import SearchBox from './SearchBox'

class WxManager extends Component {
    state = {
        loading: true,                    //表格是否加载中
        data: [],
        total: 0,                         //总数
        current: 1,                       //当前页数
        pageSize: 10,                     //每页数量
        visible: false,
        selectedRowKeys: [],              //当前有哪些行被选中, 这里只保存key
        selectedRows: [],                 //选中行的具体信息
        item: {},
        isAddMoadl: true,
        searchParams: null,               //查询参数
    }
    componentDidMount() {
        this.props.getWxManager()
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
     * 点击删除按钮, 弹出一个确认对话框
     * 注意区分单条删除和批量删除
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
                    return axios.delete(`/back/smallprogrammenu/${item.id}`)
                })).then(axios.spread((acct, perms) => {
                    console.log(acct, perms)
                    if (!acct.data.rel) {
                        message.error('删除失败')
                        return
                    }
                    message.success('删除成功')
                    this.props.getWxManager()
                }))

            },
        });
    }
    /**
     * 模态框提交按钮--增加
     * @param values
     */
    handleOk = (values, id) => {
        //console.log('Received values of form: ', values);
        if (this.state.isAddMoadl) {
            axios.post('/back/smallprogrammenu/add', values)
                .then(({ data }) => {
                    if (data.rel) {
                        message.success('添加成功！')
                        this.props.getWxManager()
                    } else {
                        message.error(data.msg, 10)
                    }
                })
        } else {
            axios.put(`/back/smallprogrammenu/${this.state.item.id}`, values).then((res) => {
                if (res.data.rel) {
                    message.success('修改成功')
                    this.props.getWxManager()
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
    };
    /**
     * 表格最后一列操作按钮
     */
    itmeEdit = (text, record, index) => {
        this.setState({
            item: record,
            visible: true,
            isAddMoadl: false
        })
    }
    /**
     * 查询功能
     * @param values 
     */
    search = (values) => {
        this.props.getWxManager({title: values.title})
    }
    hasPermissions = false;
    render() {
        const { orgType, orgLevel } = this.props.current
        // console.log(orgType, orgLevel)
        // 机构类型, 暂时无用
        // 机构类型 1 和 0 有权限修改
        if (orgType) {
            if (orgLevel === '0' || orgLevel === '1') {
                this.hasPermissions = true
            }
        }
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        //表格表头信息
        const columns = [
            {
                title: "菜单",
                dataIndex: "title",
            }, {
                title: "编码",
                dataIndex: "code",
            }, {
                title: "操作",
                width: 80,
                render: (text, record, index) => {
                    return <Button icon="edit" title="修改" onClick={() => { this.itmeEdit(text, record, index) }} />
                }
            }
        ]
        return (
            <div className="foundation-category">
                <div>
                    <Card
                        bordered={false}
                        bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                        noHovering
                    >
                        <SearchBox loading={this.props.loading} search={this.search} />
                    </Card>
                    <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                        <Row gutter={10} style={{ marginBottom: 20 }}>
                            <Col span={24} style={{ marginLeft: 14 }}>
                                <Button
                                    title="新增"
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
                                <AddModal 
                                    ref="addModal" 
                                    onOk={this.handleOk}
                                    isUpdate={!this.state.isAddMoadl}
                                    hasPermissions={this.hasPermissions}
                                    modalProps={{
                                        title: this.state.isAddMoadl ? "新增-小程序菜单" : "修改-小程序菜单",
                                        okText: "提交",
                                        width: "50%",
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
                                    loading={this.props.loading}
                                    columns={columns}
                                    dataSource={this.props.data}
                                    rowSelection={rowSelection}
                                    pagination={false}
                                    rowKey={record => record.id}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { wxManager = { data: [], isFetching: true } } = state
    return {
        current: state.userInfo.data,

        data: wxManager.data,
        loading: wxManager.isFetching
    }
}
const mapDispatchToProps = (dispath) => ({
    getWxManager: (params) => {
        dispath(getWxManager(params))
    }
})

// export default User
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WxManager)