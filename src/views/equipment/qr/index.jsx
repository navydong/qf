import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Button, Table, message, Modal } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import DropOption from '@/components/DropOption'
import AddModal from './AddModal'
import SearchBox from './SearchBox'
import Authorize from './Authorize'
import TerminalModal from './TerminalModal'
import QrCreat from './QrCreat'
import Qrname from './Qrname'

import { paginat } from '@/utils/pagination'

const confirm = Modal.confirm;
class Qr extends Component {
    state = {
        total: 0,                        //总数
        current: 1,                      //当前页数
        searchParams: {},                //查询参数
        loading: true,                   //表格是否加载中
        data: [],
        pageSize: 10,                    //每页数量
        qrVisible: false,                //生产二维码modal显示与否
        visible: false,
        qrnameVisible: false,            //维护码名modal
        authorizeViseble: false,
        selectedRowKeys: [],             // 当前有哪些行被选中, 这里只保存key
        selectedRows: [],                //选中行的具体信息
        item: {},
        isAddModal: true,
        record: '',
        terminalViseble: false,          //设备终端显示
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
    getPageList(limit = this.state.pageSize, offset = 1, params) {
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
    handleOk = (values) => {
        const { pageSize, current, searchParams } = this.state
        if (this.state.isAddModal) {
            // 添加功能
            axios.post('/back/qr/createQuickResponse', {
                quantity: values.quantity,
                codeType: values.codeType,
            }).then(({ data }) => {
                if (data.rel) {
                    message.success('添加成功！')
                    this.getPageList()
                } else {
                    message.error(data.msg)
                }
            })
        } else {
            //修改功能
            const id = this.state.item.id
            axios.get('/back/qr/update', {
                params: {
                    id,
                    codeType: values.codeType,
                    merId: values.merId
                }
            }).then(res => res.data).then(res => {
                if (res.rel) {
                    message.success(res.msg)
                    this.getPageList(pageSize, current, searchParams)
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
        this.setState({
            searchParams: values
        })
        this.getPageList(this.state.pageSize, 1, values)
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
    authorizeOk = (merId) => {
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
     * 下拉按钮组件
     */
    handleMenuClick = (record, e) => {
        switch (e.key) {
            case '1':
                //修改按钮
                this.setState({
                    isAddModal: false,
                    item: record,
                    visible: true,
                })
                break;
            case '2':
                //生成二维码
                this.setState({
                    record: record,
                    qrVisible: true,
                })
                break;
            case '3':
                // 维护码名
                this.setState({
                    qrnameVisible: true,
                    item: record
                })
                break;
            case 'del':
                this.delteItem(record.id)
                break;
        }
    }
    delteItem(id) {
        confirm({
            title: '确认删除',
            // content: 'Some descriptions',
            onOk: () => {
                axios.delete(`/back/qr/del/${id}`).then(res => {
                    const data = res.data
                    if (data.rel) {
                        message.success('删除成功')
                        this.getPageList()
                    } else {
                        message.error('删除失败')
                    }
                })
            }
        });

    }
    /** 绑定设备终端 */
    handleTerminal = (e) => {
        if (this.state.selectedRowKeys.length === 0) {
            message.info('请选择一行')
            return
        }
        this.setState({
            terminalViseble: true,
        })
    }
    terminalCancel = () => {
        this.setState({
            terminalViseble: false,
        })
    }
    terminalOk = (merId) => {
        axios.post('/back/qr/bind', {
            ids: this.state.selectedRowKeys.join(','),
            terminalId: merId,
        }).then(res => res.data).then(res => {
            if (res.rel) {
                message.success('绑定成功')
                this.getPageList()
                this.terminalCancel()
            } else {
                message.error(res.msg)
            }
        })
    }
    // 维护码名
    updateqrname = (value) => {
        const { pageSize, current, searchParams } = this.state
        axios.post('/back/qr/updateqrname', value).then(({ data }) => {
            if (data.rel) {
                message.success(data.msg)
                this.qrnameCancael()
                this.getPageList(pageSize, current, searchParams)
            } else {
                // 错误
            }
        })
    }
    // 维护码名modal取消
    qrnameCancael = () => {
        this.setState({
            qrnameVisible: false
        })
    }
    /** 绑定设备终端 */
    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        //表格表头信息
        const columns = [{
            title: '商户名称',
            dataIndex: 'merName'
        }, {
            title: '设备名称',
            dataIndex: 'terminalName',
        }, {
            title: '机构名称',
            dataIndex: 'orgName'
        }, {
            title: "二维码类型",
            dataIndex: "codeTypeValue",
            // className: 'table_text_center',
        }, {
            title: "授权状态",
            dataIndex: "authStatusValue",
        }, {
            title: '码名',
            dataIndex: 'qrName'
        }, {
            title: "码值",
            dataIndex: "id",
        },
        {
            title: "操作",
            fixed: 'right',
            render: (text, record) => (
                <DropOption
                    onMenuClick={(e) => this.handleMenuClick(record, e)}
                    menuOptions={[
                        { key: '1', name: '修改' },
                        { key: 'del', name: '删除' },
                        { key: '2', name: '生成二维码' },
                        { key: '3', name: '维护码名' }
                    ]}
                />
            )
        }]
        return (
            <div className="foundation-category">
                <BreadcrumbCustom first="设备管理" second="二维码管理" location={this.props.location} />
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
                                    title="绑定设备终端"
                                    className="btn-add-user"
                                    size="large"
                                    shape="circle"
                                    type="primary"
                                    icon="link"
                                    onClick={this.handleTerminal}
                                />
                                {/* 添加二维码modal */}
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
                                {/* 授权modal */}
                                <Authorize
                                    onOk={this.authorizeOk}
                                    modalProps={{
                                        title: "批量授权",
                                        okText: "提交",
                                        wrapClassName: "vertical-center-modal",
                                        visible: this.state.authorizeViseble,
                                        onCancel: this.authorizeCancel,

                                    }}
                                />
                                {/* 绑定设备modal */}
                                <TerminalModal
                                    onOk={this.terminalOk}
                                    modalProps={{
                                        title: "绑定设备终端",
                                        okText: "提交",
                                        wrapClassName: "vertical-center-modal",
                                        visible: this.state.terminalViseble,
                                        onCancel: this.terminalCancel,

                                    }}
                                />
                                {/* 创建二维码modal */}
                                <Modal
                                    width={1120}
                                    footer={null}
                                    visible={this.state.qrVisible}
                                    onCancel={() => {
                                        this.setState({ qrVisible: false })
                                    }}
                                >
                                    <QrCreat row={this.state.record} />
                                </Modal>
                                {/* 维护码名modal */}
                                <Qrname
                                    onOk={this.updateqrname}
                                    modalProps={{
                                        title: "维护码名",
                                        okText: "提交",
                                        item: this.state.item,
                                        visible: this.state.qrnameVisible,
                                        wrapClassName: "vertical-center-modal",
                                        onCancel: this.qrnameCancael,
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table
                                    scroll={{ x: true }}
                                    loading={this.state.loading}
                                    columns={columns}
                                    dataSource={this.state.data}
                                    rowSelection={rowSelection}
                                    pagination={pagination}
                                    rowKey="id"
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div >
        )
    }
}



export default Qr