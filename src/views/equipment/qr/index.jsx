import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Button, Table, message, Modal } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import AddModal from './AddModal'
import SearchBox from './SearchBox'
import Authorize from './Authorize'
import QrCreat from './QrCreat'


//每页请求条数 
const defaultPageSize = 10;
class Qr extends Component {
    state = {
        loading: true, //表格是否加载中
        data: [],
        total: '',
        current: 1,
        qrVisible: false,
        visible: false,
        authorizeViseble: false,
        selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
        selectedRows: [], //选中行的具体信息
        item: {},
        isAddModal: true,
        template: '',    //图片模板
        qr: ''           //二维码
    }
    componentDidMount() {
        this.getPageList()
    }
    /**
     * 
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {Object} params 其他参数
     */
    getPageList(limit = 10, offset = 1, params) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/qr/qrs', {
            params: {
                limit,
                offset,
                ...params,
            }
        }).then(({ data }) => {
            this.setState({
                total: data.total,
                data: data.rows,
                current: offset,
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
    }
    /**
     * 点击删除按钮, 弹出一个确认对话框
     * 注意区分单条删除和批量删除
     * @param e
     */
    onClickDelete = (e) => {
        e.preventDefault();
        Modal.confirm({
            title: this.state.selectedRowKeys.length > 1 ? '确认批量删除?' : '确认删除?',
            onOk: () => {
                axios.all(this.state.selectedRows.map((item) => {
                    return axios.delete(`/back/industry/remove/${item.id}`)
                })).then(axios.spread((acct, perms) => {
                    console.log(acct, perms)
                    if (!acct.data.rel) {
                        message.error('删除失败')
                        return
                    }
                    message.success('删除成功')
                    this.getPageList()
                }))

            },
        });
    }
    /**
     * 模态框提交按钮--增加
     * @param values
     */
    handleOk = (values, cb) => {
        console.log('Received values of form: ', values);
        if (this.state.isAddModal) {
            console.log(values)
            axios.post('/back/qr/createQuickResponse', values)
                .then(({ data }) => {
                    if (data.rel) {
                        message.success('添加成功！')
                        this.getPageList();
                    } else {
                        message.error(data.msg)
                    }
                })
        } else {
            const id = this.state.item.id
            axios.get('/back/qr/update', {
                params: { ...values, id }
            }).then(res => res.data).then(res => {
                if (res.rel) {
                    message.success(res.msg)
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
        this.addModal.resetFields()
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
            isAddModal: false,
            item: record,
            visible: true,
        })
    }
    /**
     * 页码改变的回调，参数是改变后的页码及每页条数
     * @param page 改变后的页码
     * @param pageSize 改变页的条数
     */
    pageChange = (page, pageSize) => {
        this.getPageList(pageSize, page)
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
        // const startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
        this.getPageList(10, 1, values)
    }

    /***********  批量授权  ***************/
    authorizeHandle = () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.info('请选择一行')
            return
        }
        this.setState({
            authorizeViseble: true,
        })
    }
    authorizeCancel = () => {
        this.setState({
            authorizeViseble: false,
        })
    }
    authorizeOk = (merId, cb) => {
        axios.post('/back/qr/authorize', {
            ids: this.state.selectedRowKeys.join(','),
            merId: merId,
        }).then(res => res.data).then(res => {
            if (res.rel) {
                message.success('授权成功')
                this.getPageList()
            } else {
                message.error(res.msg)
            }
            this.authorizeCancel()
        })
    }
    /***********  批量授权  ***************/

    /**
     * 生成二维码
     */
    qrGenerate = () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.info('请选择一行')
            return
        }
        this.setState({
            qrVisible: true,
        })
    }


    render() {
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
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
            title: "创建时间",
            dataIndex: "createTime",
        }, {
            title: '商户名称',
            dataIndex: 'merName'
        }, {
            title: '机构名称',
            dataIndex: 'orgName'
        }, {
            title: "二维码类型",
            dataIndex: "codeTypeValue",
        }, {
            title: "码值",
            dataIndex: "id",
        }, {
            title: "授权状态",
            dataIndex: "authStatusValue",
        }, {
            title: "操作",
            width: 80,
            render: (text, record, index) => {
                return <Button icon="edit" title="修改" onClick={() => { this.itmeEdit(text, record, index) }} />
            }
        }]
        return (
            <div className="foundation-category">
                <BreadcrumbCustom first="设备管理" second="二维码管理" />
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
                                    title="创建二维码"
                                    className="btn-add"
                                    size="large"
                                    shape="circle"
                                    type="primary"
                                    icon="plus"
                                    onClick={this.addHandle}
                                />
                                {/* <Button
                                    className="btn-delete"
                                    type="primary"
                                    size="large"
                                    shape="circle"
                                    icon="delete"
                                    disabled={!hasSelected}
                                    onClick={this.onClickDelete}
                                /> */}
                                <Button
                                    title="批量授权"
                                    className="btn-limit"
                                    size="large"
                                    shape="circle"
                                    type="primary"
                                    icon="lock"
                                    onClick={this.authorizeHandle}
                                />
                                <Button
                                    title="生成二维码"
                                    className="btn-add-user"
                                    icon="qrcode"
                                    shape="circle"
                                    type="primary"
                                    size="large"
                                    onClick={this.qrGenerate}
                                />
                                <AddModal
                                    ref={e => this.addModal = e}
                                    onOk={this.handleOk}
                                    modalProps={{
                                        title: this.state.isAddModal ? "新增-二维码" : "修改-二维码",
                                        okText: "提交",
                                        width: "50%",
                                        item: this.state.item,
                                        wrapClassName: "vertical-center-modal",
                                        visible: this.state.visible,
                                        onCancel: this.handleCancel
                                    }}
                                />
                                <Authorize
                                    onOk={this.handleOk}
                                    authorizeOk={this.authorizeOk}
                                    modalProps={{
                                        title: "批量授权",
                                        okText: "提交",
                                        wrapClassName: "vertical-center-modal",
                                        visible: this.state.authorizeViseble,
                                        onCancel: this.authorizeCancel,

                                    }}
                                />
                                <Modal
                                    width={1120}
                                    footer={null}
                                    visible={this.state.qrVisible}
                                    onCancel={() => {
                                        this.setState({ qrVisible: false })
                                    }}
                                >
                                    <QrCreat row={this.state.selectedRows[0]} />
                                </Modal>
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
                                    rowKey={record => (
                                        record.id
                                    )}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}



export default Qr