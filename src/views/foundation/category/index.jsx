import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Row, Col, Card, Button, Table, message, Modal } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom'
import DropOption from '@/components/DropOption/DropOption'
import SearchBox from './SearchBox'
import AddForm from './AddForm'
import { paginat } from '@/utils/pagination'



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


//每页请求条数
const defaultPageSize = 10;
class Category extends Component {
    state = {
        loading: true, //表格是否加载中
        data: [],
        total: 0,                         //总数
        current: 1,                       //当前页数
        pageSize: 10,                     //每页数量
        visible: false,
        selectedRowKeys: [],              //当前有哪些行被选中, 这里只保存key
        selectedRows: [],                 //选中行的具体信息
        item: {},
        isAddModal: true,
        first: '',
        second: '',
        category: [],
        searchParams: undefined,                 //查询参数
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
    getPageList(limit = this.state.pageSize, offset = this.state.current, name) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/industry/industrys', {
            params: {
                limit,
                offset,
                name,
            }
        }).then(({ data }) => {
            setKey(data)
            this.setState({
                data: data,
                loading: false,
            })
        }).catch(err => console.log(err))
    }
    //增加按钮
    addHandle = () => {
        this.setState({
            item: {},
            isAddModal: true,
            visible: true
        })
        // this.selectDetail()
    }
    /**
     * 点击删除按钮, 弹出一个确认对话框
     * 注意区分单条删除和批量删除
     * @param e
     */
    onClickDelete = (e) => {
        e.preventDefault();
        Modal.confirm({
            title: '确认删除?',
            onOk: () => {
                const id = this.state.selectedRows[0].id
                axios.delete(`/back/industry/remove/${id}`).then(res => res.data).then(res => {
                    if (res.rel) {
                        message.success('删除成功')
                        this.getPageList()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        });
    }
    /**
     * 发送http请求，删除数据，更新表格    未使用
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
    handleOk = (e) => {
        this.form.validateFields((err, values) => {
            if (err) {
                return
            }
            values.pid = values.pid && values.pid[values.pid.length - 1]
            if (this.state.isAddModal) {
                axios.post('/back/industry/industry', values)
                    .then(({ data }) => {
                        if (data.rel) {
                            message.success('添加成功！')
                            //重新获取一遍数据
                            this.getPageList();
                        }
                    })
            } else {
                const id = this.state.item.id
                axios.put(`/back/industry/${id}`, values).then(res => res.data).then(res => {
                    if (res.rel) {
                        this.getPageList();
                    } else {
                        message.error(res.msg)
                    }
                })
            }
            //这里无论提交成功失败，都要关闭模态框，清空表单内容
            this.setState({
                visible: false,
            });
            // 清空表单
            this.form.resetFields()
        })
    }
    /**
     * 模态框取消按钮
     */
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.form.resetFields();
    }
    /**
     * 处理表格的选择事件
     *
     * @param selectedRowKeys
     */
    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRows)
        this.setState({ selectedRowKeys, selectedRows });
    };
    /**
     * 下拉按钮组件
     */
    handleMenuClick = (record, e) => {
        if (e.key === '1') {
            //修改按钮
            this.setState({
                item: record,
                isAddModal: false,
                visible: true,
            })
            this.selectDetail(record.id, record.passwayId)
        } else if (e.key === '2') {
            //删除按钮
            Modal.confirm({
                title: '确认删除?',
                onOk: () => {
                    axios.delete(`/back/industry/remove/${record.id}`).then(res => res.data).then(res => {
                        if (res.rel) {
                            message.success('删除成功')
                            this.getPageList()
                        } else {
                            message.error(res.msg)
                        }
                    })
                }
            })
        }
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
     * pageSize 变化的回调
     * @param current 当前页码
     * @param pageSize 改变后每页条数
     */
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize,
            current: current
        })
        this.getPageList(pageSize, current, this.state.searchParams)
    }
    /**
     * 查询功能
     * @param values
     */
    search = (values) => {
        console.log(values.industryName)
        this.setState({
            searchParams: values.industryName
        })
        this.getPageList(this.state.pageSize, 1, values.industryName)
    }
    /**
     * 获取上级行业
     * @param {*} id 当前行id
     * @param {String} passwayId 通道id 
     */
    selectDetail(id, passwayId) {
        axios.get('/back/industry/industrys', { params: { id, passwayId } })
            .then(res => res.data)
            .then(res => {
                function d(s) {
                    s.forEach(item => {
                        item.value = item.id
                        item.label = item.industryName
                        // item.disable = true
                        if (item.children) {
                            d(item.children)
                        }
                    })
                }
                d(res)
                setKey(res)
                this.setState({
                    category: res
                })
            })
    }
    render() {
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
        const columns = [
            {
                title: "行业名称",
                dataIndex: "industryName",
            }, {
                title: "通道",
                dataIndex: "passwayName",
            }, {
                title: "上级行业",
                dataIndex: "parentName",
            },
            // {
            //     title: "费率",
            //     dataIndex: "rate",
            // }, 
            {
                title: "结算周期T+",
                dataIndex: "cycle",
            },
            // {
            //     title: "创建人",
            //     dadaIndex: "creatorId",
            // },
            {
                title: "创建时间",
                dataIndex: "createTime",
            },
            // {
            //     title: "修改人",
            //     dataIndex: "lastEditorid",
            // }, 
            {
                title: "修改时间",
                dataIndex: "lastEdittime",
            }, {
                title: "操作",
                render: (text, record) => (
                    <DropOption
                        onMenuClick={(e) => this.handleMenuClick(record, e)}
                        menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]}
                    />
                )
            }
        ]
        return (
            <div className="foundation-category">
                <BreadcrumbCustom first={this.state.first} second={this.state.second} location={this.props.location} />
                <div>
                    <Card
                        bordered={false}
                        bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                        noHovering
                    >
                        <SearchBox loading={this.state.loading} search={this.search} />
                    </Card>
                    <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                        <Row gutter={40} style={{ marginBottom: 20 }}>
                            <Col span={24} style={{ marginLeft: 14 }}>
                                <Button
                                    className="btn-add"
                                    size="large"
                                    shape="circle"
                                    type="primary"
                                    icon="plus"
                                    onClick={this.addHandle}
                                />
                                <Button
                                    className="btn-delete"
                                    type="primary"
                                    size="large"
                                    shape="circle"
                                    icon="delete"
                                    disabled={!hasSelected}
                                    onClick={this.onClickDelete}
                                />
                                <Modal
                                    onOk={this.handleOk}
                                    title={this.state.isAddModal ? "新增-行业类目" : "修改-行业类目"}
                                    okText="提交"
                                    width="50%"
                                    wrapClassName="vertical-center-modal"
                                    visible={this.state.visible}
                                    onCancel={this.handleCancel}
                                    isAddModal={this.state.isAddModal}
                                >
                                    <AddForm
                                        ref={e => this.form = e}
                                        item={this.state.item || {}}
                                        category={this.state.category}
                                        selectDetail={(undefined, value) => this.selectDetail(undefined, value)}
                                    />
                                </Modal>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table
                                    // scroll={{ x: 944 }}
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
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        category: state.category
    }
}
const mapDispatchToProps = (dispatch) => {
    return dispatch => {
        axios.get('/back/industry/industrys').then(({ data }) => {
            dispatch({
                type: 'GET_CATEGORY_LIST',
                data: data
            })
        })
    }
}

export default connect(
    // mapStateToProps,
    // mapDispatchToProps
)(Category)
