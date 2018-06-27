import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Button, Table, message, Modal, notification } from 'antd'
import { connect } from 'react-redux'

import { paginat } from '@/utils/pagination'
import AddModal from './AddModal'
import SearchBox from './SearchBox'
import BdModal from './BdModal'

class User extends Component {
    _isMounted = false
    hasPermissions = false;
    state = {
        loading: true,                    //表格是否加载中
        data: [],
        total: 0,                         //总数
        current: 1,                       //当前页数
        pageSize: 10,                     //每页数量
        visible: false,
        bdvisible: false,                 //bd关系modal
        selectedRowKeys: [],              //当前有哪些行被选中, 这里只保存key
        selectedRows: [],                 //选中行的具体信息
        item: {},
        isAddMoadl: true,
        searchParams: null,               //查询参数
    }
    componentDidMount() {
        this._isMounted = true
        this.getPageList()

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    /**
     * 获取列表信息
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {String} name 通道名称
     * @returns null
     */
    getPageList(limit = this.state.pageSize, offset = 1, name) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/user/page', {
            params: {
                limit,
                offset,
                name,
            }
        }).then(({ data }) => {
            this._isMounted && this.setState({
                total: data.total,
                data: data.rows,
                current: offset,
                loading: false,
            })
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
     * 点击删除按钮, 弹出一个确认对话框
     * 注意区分单条删除和批量删除
     * @param e
     */
    onClickDelete = (e) => {
        Modal.confirm({
            title: '确认删除',
            // 这里注意要用箭头函数, 否则this不生效
            onOk: () => {
                const id = this.state.selectedRowKeys[0]
                axios.delete(`/back/user/delete/${id}`).then(({ data }) => {
                    if (data.rel) {
                        message.success('删除成功')
                        this.getPageList(this.state.pageSize, this.state.current, this.state.searchParams)
                    } else {
                        message.error(data.msg)
                    }
                })

            },
        });
    }
    /**
     * 模态框提交按钮--增加
     * @param values
     */
    handleOk = (values, id) => {
        const { pageSize, current, searchParams } = this.state;
        if (this.state.isAddMoadl) {
            axios.post('/back/user/add', values)
                .then(({ data }) => {
                    if (data.rel) {
                        message.success('添加成功！')
                        this.getPageList();
                    } else {
                        message.error(data.msg, 10)
                    }
                })
        } else {
            // 修改时不修改密码
            delete values.passwordadd;
            axios.put(`/back/user/edit/${this.state.item.id}`, values).then((res) => {
                if (res.data.rel) {
                    message.success('修改成功')
                    this.getPageList(pageSize, current, searchParams);
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
        this.setState({ selectedRowKeys, item: selectedRows[0] });
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
     * 页码改变的回调，参数是改变后的页码及每页条数
     * @param page 改变后的页码
     * @param pageSize 改变页的条数
     */
    pageChange = (page, pageSize) => {
        this.setState({
            pageSize: pageSize,
            current: page
        })
        this.getPageList(pageSize, page, this.state.searchParams)
    }
    /**
     * pageSize(每页显示多少条) 变化的回调
     * @param current 当前页码
     * @param pageSize 改变后每页条数
     */
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize,
            current: current
        })
        this.getPageList(pageSize, current)
    }
    /**
     * 查询功能
     * @param values 
     */
    search = (values) => {
        this.setState({
            searchParams: values.name
        })
        this.getPageList(this.state.pageSize, 1, values.name)
    }

    // bd关系
    bdrelationClick = () => {
        const { selectedRowKeys, item } = this.state
        const id = selectedRowKeys[0]
        const userGroupId = item.groupId
        if (selectedRowKeys.length > 0 && userGroupId === '54ac58951527429eb5a5df378eb74b62') {
            this.bdMoadl.getPageList(id)
            this.setState({
                bdvisible: true
            })
        } else {
            message.warn('请选择角色为商务拓展的用户')
        }

    }
    bdCancel = () => {
        this.setState({
            bdvisible: false
        })
    }
    bdonOk = (values) => {
        this.setState({
            bdvisible: false
        })
    }

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
            type: 'radio',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        //表格表头信息
        const columns = [{
            title: "用户名",
            dataIndex: "username",
        }, {
            title: "姓名",
            dataIndex: "name",
        }, {
            title: "机构名称",
            dataIndex: "orgName",
        }, {
            title: "角色",
            dataIndex: 'groupName'
        }, {
            title: "操作",
            width: 80,
            render: (text, record, index) => {
                return <Button icon="edit" title="修改" onClick={() => { this.itmeEdit(text, record, index) }} />
            }
        }]
        return (
            <div className="foundation-category">
                <div>
                    <Card
                        bordered={false}
                        bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                        noHovering
                    >
                        <SearchBox loading={this.state.loading} search={this.search} />
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
                                ></Button>
                                <Button
                                    title="删除"
                                    className="btn-delete"
                                    type="primary"
                                    size="large"
                                    shape="circle"
                                    icon="delete"
                                    disabled={!hasSelected}
                                    onClick={this.onClickDelete}
                                ></Button>
                                <Button
                                    title="BD商户关系维护"
                                    className="btn-add-user"
                                    type="primary"
                                    size="large"
                                    shape="circle"
                                    icon="team"
                                    onClick={this.bdrelationClick}
                                ></Button>
                                <AddModal ref="addModal" onOk={this.handleOk}
                                    hasPermissions={this.hasPermissions}
                                    modalProps={{
                                        title: this.state.isAddMoadl ? "新增-用户" : "修改-用户",
                                        okText: "提交",
                                        width: "50%",
                                        item: this.state.item,
                                        wrapClassName: "vertical-center-modal",
                                        visible: this.state.visible,
                                        onCancel: this.handleCancel
                                    }}
                                />
                                {/* BD商户关系维护modal */}
                                <BdModal
                                    ref={e => this.bdMoadl = e}
                                    userId={this.state.item.id}
                                    onOk={this.bdonOk}
                                    modalProps={{
                                        title: "BD商户关系维护",
                                        okText: "提交",
                                        width: "50%",
                                        item: this.state.item,
                                        wrapClassName: "vertical-center-modal",
                                        visible: this.state.bdvisible,
                                        onCancel: this.bdCancel
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table
                                    loading={this.state.loading}
                                    columns={columns}
                                    rowKey="id"
                                    dataSource={this.state.data}
                                    rowSelection={rowSelection}
                                    pagination={pagination}
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
    return {
        users: state.users,
        current: state.userInfo.data,
    }
}
// const mapDispatchToProps = (dispath) => ({
//     getUsers: (params) => {
//         dispath(getUsers(params))
//     }
// })

// export default User
export default connect(
    mapStateToProps,
    // mapDispatchToProps
)(User)