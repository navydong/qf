import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Input, Button, Select, Table, message, Modal, notification } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import DropOption from './DropOption'
import AddModal from './AddModal'
import SearchBox from './SearchBox'
import MenuRigth from './MenuRigth'
import './menu.less'

//增加

//给数据增加key值，key=id
function setKey(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].key = data[i].id
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
}

const FormItem = Form.Item
const Option = Select.Option
const ButtonGroup = Button.Group

//每页请求条数 
const defaultPageSize = 10;
class Menu extends Component {
    state = {
        loading: true, //表格是否加载中
        data: [],
        total: '',
        current: 1,
        visible: false,
        selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
        selectedRows: [], //选中行的具体信息
        item: {},
        isAddMoadl: true
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
    getPageList(title) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/menu/list', {
            params: {
                title
            }
        }).then(({ data }) => {
            setKey(data)
            this.setState({
                total: data.length,
                data: data,
                loading: false,
            })
        }).catch(err => {
            console.log(err)
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

    //增加按钮
    addHandle = () => {
        this.setState({
            item: '',
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
            content: `当前被选中的行: ${this.state.selectedRowKeys.join(', ')}`,
            // 这里注意要用箭头函数, 否则this不生效
            onOk: () => {
                axios.all(this.state.selectedRows.map((item) => {
                    console.log(item)
                    return axios.delete(`/back/menu/${item.id}`)
                })).then(axios.spread((acct, perms) => {
                    console.log(acct, perms)
                    if (!acct.data.rel) {
                        message.error('删除失败')
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
    /**
     * 模态框提交按钮--增加
     * @param values
     */
    handleOk = (values) => {
        if (this.state.isAddMoadl) {
            axios.post('/back/menu', values)
                .then(({ data }) => {
                    if (data.rel) {
                        message.success('添加成功！')
                        this.getPageList();
                    }
                }).catch((err) => {
                    notification.open({
                        message: '添加失败',
                        description: err.message,
                    });
                })
        } else {
            axios.put(`/back/menu/${values.id}`, values).then(({ data }) => {
                if (data.rel) {
                    this.getPageList()
                }
            }).catch((err) => {
                notification.open({
                    message: "修改失败",
                    description: err.message
                })
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
        console.log(selectedRows[0])
        this.menuRight.getPageList(10, 1, selectedRowKeys[0])
        this.setState({ selectedRowKeys, selectedRows });
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
        //console.log(values.name)
        this.setState({
            loading: true
        })
        this.getPageList(values.title)
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
            title: "菜单",
            dataIndex: "title",
        }, {
            title: "编码",
            dataIndex: "code",
        }, {
            title: "url",
            dataIndex: "href",
        }, {
            title: "修改",
            render: (text, record, index) => {
                return <Button icon="edit" onClick={() => { this.itmeEdit(text, record, index) }} />
            }
        }]
        return (
            <div className="foundation-category">
                <BreadcrumbCustom first="基础配置管理" second="菜单管理" user />
                <div>

                    <Card
                        bordered={false}
                        bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                        noHovering
                    >
                        <SearchBox loading={this.state.loading} search={this.search} />
                    </Card>
                    <Row gutter={10}>
                        <Col span={12}>
                            <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                                <Row gutter={10} style={{ marginBottom: 20 }}>
                                    <Col span={24} style={{marginLeft:14}}>
                                        <Button
                                            className="btn-add"
                                            size="large"
                                            shape="circle"
                                            type="primary"
                                            icon="plus"
                                            onClick={this.addHandle}
                                        ></Button>
                                        <Button 
                                            className="btn-delete"
                                            type="primary"
                                            size="large"
                                            shape="circle"
                                            icon="delete"
                                            disabled={!hasSelected}
                                            onClick={this.onClickDelete}
                                        >
                                        </Button>
                                        <AddModal ref="addModal" onOk={this.handleOk}
                                            modalProps={{
                                                title: "新增",
                                                okText: "提交",
                                                width: "50%",
                                                item: this.state.item,
                                                wrapClassName: "vertical-center-modal",
                                                visible: this.state.visible,
                                                onCancel: this.handleCancel
                                            }}
                                            parentId={this.state.selectedRows.length > 0 ? this.state.selectedRows[0].id : -1}
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
                        <Col span={12}>
                            <MenuRigth ref={(e) => { this.menuRight = e }} selected={this.state.selectedRowKeys.length > 0} />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}



export default Menu