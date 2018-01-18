import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Button, Table, message, Modal, notification } from 'antd'
import { connect } from 'react-redux'
import { getUsers } from '../../../redux/actions'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import AddModal from './AddModal'
import SearchBox from './SearchBox'

class User extends Component {
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
        this.getPageList()
        this.props.getUsers()

    }
    /**
     * 获取列表信息
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {String} name 通道名称
     * @returns null
     */
    getPageList(limit = this.state.pageSize, offset = this.state.current, name) {
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
            data.rows.forEach((item, index) => {
                item.key = `${index}`
            })
            this.setState({
                total: data.total,
                data: data.rows,
                current: offset,
                loading: false,
            })
        }).catch(err => {
            console.log(err.message)
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
        e.preventDefault();
        Modal.confirm({
            title: this.state.selectedRowKeys.length > 1 ? '确认批量删除' : '确认删除',
            // 这里注意要用箭头函数, 否则this不生效
            onOk: () => {
                axios.all(this.state.selectedRows.map((item) => {
                    console.log(item)
                    return axios.delete(`/back/user/delete/${item.id}`)
                })).then(axios.spread((acct, perms) => {
                    console.log(acct, perms)
                    if (!acct.data.rel) {
                        message.error('删除失败')
                        return
                    }
                    message.success('删除成功')
                    this.handleDelete();
                }))

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
    /**
     * 模态框提交按钮--增加
     * @param values
     */
    handleOk = (values, id) => {
        //console.log('Received values of form: ', values);
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
                    this.getPageList();
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
        const pagination = {
            defaultPageSize: this.state.pageSize,
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
            title: "用户名",
            dataIndex: "username",
        }, {
            title: "姓名",
            dataIndex: "name",
        }, {
            title: "机构名称",
            dataIndex: "orgName",
        }, {
            title: "操作",
            width: 80,
            render: (text, record, index) => {
                return <Button icon="edit" title="修改" onClick={() => { this.itmeEdit(text, record, index) }} />
            }
        }]
        return (
            <div className="foundation-category">
                <BreadcrumbCustom first="权限管理" second="用户管理" user location={this.props.location} />
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
                                >
                                    {/*multiSelected ? '批量删除' : '删除'*/}
                                </Button>
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
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.httpData.users,
        current: state.httpData.user.data,
    }
}
const mapDispatchToProps = (dispath) => ({
    getUsers: (params) => {
        dispath(getUsers(params))
    }
})

// export default User
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(User)