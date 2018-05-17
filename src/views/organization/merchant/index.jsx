import React from 'react'
import axios from 'axios'
import QRCode from 'qrcode'  //https://github.com/soldair/node-qrcode
import { Row, Col, Button, Card, Table, Modal, Spin, message, Badge, Tooltip } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import MerchantModal from './MerchantModal'
import MerchantHeader from './MerchantHeader'
import BulkImport from './BulkImport'
import DropOption from '@/components/DropOption'
import { sloveRespData } from '@/utils/index'
import { paginat } from '@/utils/pagination'
import "../merchant.less"
import EditableCell from './EditableCell'
// import { setKey } from '@/utils/setkey'

function treeMarkPid(data, parentId = 0) {
    if (!Array.isArray(data)) return
    data.forEach(function (item, index) {
        var children = item.children
        item.zIndex = parentId
        if (children.length > 0) {
            treeMarkPid(children, parentId + 1)
        } else {
            delete item.children
        }
    })
    return data
}

const setKey = function (data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
    return data
}

const confirm = Modal.confirm
const statusMap = ['default', 'warning', 'error', 'warning', 'success', 'processing'];
const status = ['未提交', '审核中', '未通过', '账户验证', '签约完成', '上线中']
class Merchant extends React.Component {
    _isMounted = false
    state = {
        pageSize: 10,                          //分页大小
        current: 1,                            //当前页码
        searchParams: {},                      //查询参数
        loading: false,
        visible: false,
        importVisible: false,
        passway: [],
        dataSource: [],
        selectedRowKeys: [],
        total: '',
        modalTitle: '新增-商户基本信息',
        isUpdate: false,
        tabInfos: {},
        qrVisible: false,                      //支付通知二维码模态框
        spinLoading: true,                     //支付通知二维码加载loading
        qrImg: '',
        confirmLoading: false,                 //确定按钮 loading
        qrBase64: '',                          //授权商户二维码base64
        modalRandomKey: -1,
    }
    componentWillMount() {
        this.handlerSelect();
        this._getPassWay();
        this.selectMerchant();
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    /**
     * 获取
     * 
     * @param {Number} [limit=1] 
     * @param {Number} [offset=1] 
     * @param {Object} param  查询参数
     */
    handlerSelect(limit = 10, offset = 1, param) {
        this.setState({
            loading: true
        });
        axios.get('/back/merchantinfoController/page', {
            params: {
                limit,
                offset,
                ...param
            }
        }).then((resp) => {
            const dataSource = treeMarkPid(resp.data.rows);
            const total = resp.data.total;
            this._isMounted && this.setState({
                dataSource,
                loading: false,
                current: offset,
                total
            })
        })
    }
    // 搜索按钮
    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            if (err) return
            if (values.region) {
                values.region = values.region.join(',')
            }
            this.setState({
                searchParams: values
            })
            this.handlerSelect(this.state.pageSize, 1, values)
        })
    }
    // 获取通道
    _getPassWay() {
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            if (!this._isMounted) return
            this._isMounted && this.setState({
                passway
            })
        })
    }

    // 下拉菜单选项
    handleMenuClick(record, e) {
        const self = this;
        const id = record.id;
        switch (e.key) {
            case '1': //修改
                let updateStatus = true;
                let SelectedPasswayIds = record.passwayIds || ''
                let SelectedAcctype = (record.acctype !== undefined) ? String(record.acctype) : undefined
                this.selectMerchant(record.id)
                this.setState({
                    isUpdate: true,
                    tabInfos: record,
                    SelectedPasswayIds,
                    SelectedAcctype,
                })
                this.showModal(updateStatus)
                break;
            case '2':  //删除
                self.handleDelete(id)
                break;
            case '3':  //交易明细
                this.props.router.push(`/app/reportQuert/tradeBlotter/${id}`)
                break;
            case '4':  //支付通知
                this.setState({
                    qrVisible: true,
                });
                axios.get('/back/wxwallet/getwxqr', {
                    params: {
                        merchantId: record.id
                    },
                    responseType: 'blob'
                }).then((res) => {
                    this.setState({
                        spinLoading: false
                    })
                    var reader = new FileReader()
                    reader.addEventListener('load', () => {
                        this.setState({
                            qrImg: reader.result
                        })
                    })
                    reader.readAsDataURL(res.data)
                })
                break;
            case '5':  //商户授权
                axios.get('/back/aliWallet/appAuthUrl', {
                    params: {
                        merchantId: record.id
                    }
                }).then(({ data }) => {
                    if (data.rel) {
                        QRCode.toDataURL(data.result)
                            .then(url => {
                                Modal.info({
                                    title: '商户给支付宝授权',
                                    okText: '确定',
                                    content: (
                                        <div>
                                            <h3>网页授权链接</h3>
                                            <p style={{ wordBreak: 'break-all' }}>
                                                {data.result}
                                                {/* <a href={data.result} style={{wordBreak: 'break-all'}}>
                                                    <p>{data.result}</p>
                                                </a> */}
                                            </p>
                                            <h3 style={{ marginTop: 10 }}>授权二维码</h3>
                                            <img src={url} alt="" />
                                        </div>
                                    ),
                                })
                            })
                    } else {
                        message.error(data.msg)
                    }
                })
                break;
            default: null
        }
    }
    // 新增
    handlerAdd(params) {
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({}, tabInfos, params)

        if (params.region) {
            options.region = options.region.join(',')
        }
        if (params.passwayIds) {
            options.passwayIds = options.passwayIds.join(',')
        }
        axios.post(`/back/merchantinfoController/save `, options).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                this.setState({
                    confirmLoading: false,
                    visible: false
                })
                message.success('新增成功')
                this.handlerSelect()
                // 跟新上级商户
                this.selectMerchant()
                this.refs.form.resetFields()
            } else {
                this.setState({
                    confirmLoading: false,
                })
                message.error(data.msg)
            }
        })
    }
    // 删除
    handleDelete(id) {
        const self = this;
        if (id) {
            confirm({
                title: '确定要删除吗?',
                content: <span style={{ color: 'red', fontWeight: 700 }}>如删除商户信息，商户所有设备及二维码都将删除</span>,
                onOk() {
                    axios.delete(`/back/merchantinfoController/deleteByIds/${id}`).then((res) => {
                        if (res.data.rel) {
                            message.success('删除成功')
                            self.handlerSelect()
                        }
                    })
                }
            })
            return
        }
        const keys = this.state.selectedRowKeys;
        confirm({
            title: keys.length > 1 ? '确定要删除吗？' : '确定要批量删除吗？',
            content: <span style={{ color: 'red', fontWeight: 700 }}>如删除商户信息，商户所有设备及二维码都将删除</span>,
            onOk() {
                axios.all(
                    keys.map(item => {
                        return axios.delete(`/back/merchantinfoController/deleteByIds/${item}`)
                    })
                ).then(axios.spread((acc, pers) => {
                    if (acc.data.rel) {
                        message.success('删除成功')
                        self.handlerSelect()
                    }
                }))
            },
        })
    }
    // 修改
    handleUpdate(params) {
        const { pageSize, current, searchParams, tabInfos } = this.state
        params.id = tabInfos.id
        if (params.passwayIds) {
            params.passwayIds = params.passwayIds.join(',');
        }
        if (params.region) {
            params.region = params.region.join(',')
        }
        axios.put(`/back/merchantinfoController/update/${params.id}`, params).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('修改成功')
                this.handlerSelect(pageSize, current, searchParams)
                this.handlerHideModal()
                // 更新上级商户
                this.selectMerchant(params.id)
                this.refs.form.resetFields()
            } else {
                this.setState({
                    confirmLoading: false
                })
                message.error(data.msg)
            }
        })
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    showModal(status) {
        if (status) {
            this.setState({
                modalRandomKey: Math.random(),
                visible: true,
                modalTitle: '修改-商户基本信息',
                isUpdate: true,
            });
        } else {
            this.setState({
                modalRandomKey: Math.random(),
                visible: true,
                modalTitle: '新增-商户基本信息',
                tabInfos: {},
                isUpdate: false,
                SelectedPasswayIds: '',
                SelectedAcctype: '',
            });
        }
    }

    handlerHideModal = (e) => {
        this.setState({
            visible: false,
            confirmLoading: false
        })
        this.refs.form.resetFields()
    }

    handlerClickImport = () => {
        this.setState({
            importVisible: true
        })
    }
    // 模态框确认按钮
    handlerModalOk = () => {
        const isUpdate = this.state.isUpdate;
        this.refs.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (err) return;
            fieldsValue.pid = fieldsValue.pid && fieldsValue.pid.pop();
            fieldsValue.wxindustryId = fieldsValue.wxindustryId && fieldsValue.wxindustryId.pop();
            fieldsValue.zfbindustryId = fieldsValue.zfbindustryId && fieldsValue.zfbindustryId.pop();
            this.setState({
                confirmLoading: true
            })
            // 客服电话默认为联系电话
            if (!fieldsValue.customerTel) {
                fieldsValue.customerTel = fieldsValue.lkmphone
            }
            // 格式化日期
            if (fieldsValue.idendtstart) {
                fieldsValue.idendtstart = fieldsValue.idendtstart.format('YYYY-MM-DD')
            }
            if (fieldsValue.idendtend) {
                fieldsValue.idendtend = fieldsValue.idendtend.format('YYYY-MM-DD')
            }

            if (isUpdate) {
                this.handleUpdate(fieldsValue)
            } else {
                this.handlerAdd(fieldsValue)
            }
        });
    }
    // 重置按钮
    handleReset = () => {
        this.refs.normalForm.resetFields();
    }
    // 支付通知二维码
    setQrModalVisible = (modalVisible) => {
        this.setState({
            qrVisible: modalVisible,
            spinLoading: true
        })
    }
    //商户信息zip下载
    downloadClick = () => {
        const id = this.state.selectedRowKeys[0]
        if (this.state.selectedRowKeys.length < 1) {
            message.info('请选择商户')
            return
        }
        window.location.href = `/back/merchantinfoController/downloadMerchantinfo?id=${id}`
    }
    /**
    * 格式成Cascader组件所需格式
    * @param {*} res 
    */
    formCascaderData(res, label, disableId) {
        (function d(s) {
            s.forEach(item => {
                item.value = item.id
                item.label = item[label]
                if (item.id === disableId) {
                    debugger
                    // item.disabled = true
                }
                if (item.children) {
                    d(item.children)
                }
            })
        })(res)
        return setKey(res)
    }
    //上级商户
    selectMerchant(disableId) {
        axios.get(`/back/merchantinfoController/page`, {
            params: {
                limit: 100,
                offset: 1,
                id: disableId
            }
        }).then((resp) => {
            const merchant = this.formCascaderData(resp.data.rows, 'merchantName', disableId);
            merchant.unshift({ value: '0', label: '无' })
            this._isMounted && this.setState({
                merchant
            })
        })
    }
    // 进件状态单元格
    onCellChange = (record, dataIndex) => {
        return (value) => {
            record[dataIndex] = value
            this.setState({
                tabInfos: record
            })
            this.handleUpdate(record)
        };
    }
    render() {
        // 表头
        const columns = [
            {
                title: "商户名称",
                dataIndex: 'merchantName',
                render: (text, record, index) => {
                    let maxWidth = 230 - record.zIndex * 20
                    if (record.zIndex * 20 >= 230) {
                        maxWidth = 10
                    }
                    return (
                        <div title={text} style={{ display: 'inline-block', maxWidth: maxWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }} >
                            {text}
                        </div>
                    )
                }
            },
            {
                title: "商户简称",
                dataIndex: 'merchantStname'
            },
            {
                title: '可用通道',
                dataIndex: 'passwayNames',
                width: 100
            },
            {
                title: '',
                dataIndex: 'isAuthorize',
                render: (text) => {
                    if (text) {
                        return '已授权'
                    } else {
                        return '未授权'
                    }
                }
            },
            {
                title: '进件状态',
                dataIndex: 'auditstate',
                width: 80,
                render: (text, record) => (
                    // text = Math.floor(Math.random() * 5)
                    <Badge status={statusMap[text]} text={status[text]} />
                    // <EditableCell
                    //     value={status[text]}
                    //     onChange={this.onCellChange(record, 'auditstate')}
                    // />
                ),
            },
            {
                title: '用户所在地区',
                dataIndex: 'region',
                width: 150
            },
            {
                title: '联系人姓名',
                dataIndex: 'linkman',
                width: 110
            },
            {
                title: '联系人手机',
                dataIndex: 'lkmphone',
                width: 110
            },
            {
                title: '操作',
                dataIndex: 'action',
                width: 80,
                fixed: 'right',
                render: (text, record) => {
                    return <DropOption
                        onMenuClick={e => this.handleMenuClick(record, e)}
                        menuOptions={[
                            { key: '1', name: '修改' },
                            { key: '2', name: '删除' },
                            { key: '3', name: '交易明细' },
                            { key: '4', name: '支付通知' },
                            { key: '5', name: '商户授权' }
                        ]}
                    />
                }
            }
        ]
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.handlerSelect(pageSize, current, searchParams)
        })
        return (
            <div className="merchant-wrapper">
                {/* 面包屑导航 */}
                <BreadcrumbCustom first="机构信息" second="商户" location={this.props.location} />
                {/* 搜索框 */}
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}>
                    <MerchantHeader
                        ref="normalForm"
                        onSubmit={this.handlerNormalForm}
                        passway={this.state.passway}
                    />
                    <div style={{ float: 'right' }}>
                        <Button
                            type="primary"
                            loading={this.state.loading}
                            onClick={this.handlerNormalForm}
                            className={'btn-search'}
                        >查询</Button>
                        <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                    </div>
                </Card>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    {/* 按钮组 */}
                    <Row>
                        <Col span={24}>
                            <Button
                                title="新增"
                                type="primary"
                                onClick={() => { this.showModal() }}
                                className="btn-add"
                                size="large"
                                shape="circle"
                                icon="plus"
                            />
                            <Button
                                title="删除"
                                onClick={() => { this.handleDelete() }}
                                disabled={selectedRowKeys.length > 0 ? false : true}
                                className="btn-delete"
                                type="primary"
                                size="large"
                                shape="circle"
                                icon="delete"
                            />
                            <Button
                                title="导入商户信息"
                                className="btn-add-user"
                                onClick={this.handlerClickImport}
                                type="primary"
                                size="large"
                                shape="circle"
                                icon="export"
                            />
                            <Button
                                title="商户信息下载"
                                // className="btn-add-user"
                                onClick={this.downloadClick}
                                type="primary"
                                size="large"
                                shape="circle"
                                icon="download"
                            />
                        </Col>
                    </Row>
                    {/* 表格 */}
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                rowKey="id"
                                scroll={{ x: '130%' }}
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={this.state.dataSource}
                                pagination={pagination}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    {/* 模态框 */}
                    <Row>
                        {/* 商户信息模态框 */}
                        <Modal
                            key={this.state.modalRandomKey}
                            width="768px"
                            maskClosable={false}
                            wrapClassName="vertical-center-modal"
                            title={this.state.modalTitle}
                            onOk={this.handlerModalOk}
                            onCancel={this.handlerHideModal}
                            visible={this.state.visible}
                            confirmLoading={this.state.confirmLoading}
                        >
                            <MerchantModal
                                ref="form"
                                onSubmit={this.handlerModalOk}
                                passway={this.state.passway}
                                tabInfos={this.state.tabInfos}
                                isUpdate={this.state.isUpdate}
                                merchant={this.state.merchant}
                                SelectedPasswayIds={this.state.SelectedPasswayIds}
                                SelectedAcctype={this.state.SelectedAcctype}
                                handlePaySelectChange={(value) => { this.setState({ SelectedPasswayIds: value }) }}
                                handleTypeChange={(value) => { this.setState({ SelectedAcctype: value }) }}
                            />
                        </Modal>
                        {/* 导入商户模态框 */}
                        <Modal
                            title="批量导入商户基本信息"
                            wrapClassName="vertical-center-modal"
                            onCancel={() => { this.setState({ importVisible: false }) }}
                            visible={this.state.importVisible}
                            footer={null}
                        >
                            <BulkImport />
                        </Modal>
                        {/* 通知二维码模态框 */}
                        <Modal
                            wrapClassName="vertical-center-modal"
                            visible={this.state.qrVisible}
                            onCancel={() => this.setQrModalVisible(false)}
                            footer={null}
                        >
                            <Spin
                                size="large"
                                spinning={this.state.spinLoading}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <img src={this.state.qrImg} alt="支付通知二维码生成失败" />
                                </div>
                            </Spin>
                        </Modal>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default Merchant