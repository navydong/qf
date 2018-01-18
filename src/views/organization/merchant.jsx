import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import axios from 'axios'
//https://github.com/soldair/node-qrcode
import QRCode from 'qrcode'
import { Row, Col, Button, Card, Table, Modal, Spin, message } from 'antd'
import MerchantModal from '../../components/organization/merchant/MerchantModal'
import MerchantHeader from '../../components/organization/merchant/MerchantHeader'
import BulkImport from '../../components/organization/merchant/BulkImport'
import "./merchant.less"
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'

const confirm = Modal.confirm
const defaultPageSize = 10;

class Merchant extends React.Component {
    state = {
        loading: false,
        visible: false,
        importVisible: false,
        passway: [],
        dataSource: [],
        selectedRowKeys: [],
        current: 1,
        total: '',
        modalTitle: '新增-商户基本信息',
        isUpdate: false,
        tabInfos: {},
        pageSize: 10,                          //分页大小
        searchParams: {},                      //查询参数
        qrVisible: false,                      //支付通知二维码模态框
        spinLoading: true,                     //支付通知二维码加载loading
        qrImg: '',
        confirmLoading: false,                 //确定按钮 loading
        qrBase64: '',                          //授权商户二维码base64
        columns: [
            {
                title: "序号",
                dataIndex: 'order_id',
                render: (text, record) => <a href={record.url} target="_blank">{text}</a>
            },
            {
                title: "商户名称",
                dataIndex: 'merchantName',
                width: 150
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
                title: '用户所在地区',
                dataIndex: 'region'
            },
            {
                title: '联系人姓名',
                dataIndex: 'linkman'
            },
            {
                title: '联系人手机',
                dataIndex: 'lkmphone',
                width: 110
            },
            {
                title: '操作',
                dataIndex: 'action',
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
    }
    componentWillMount() {
        this.handlerSelect();
        this._getPassWay()
    }

    _getPassWay() {
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
    }

    handleMenuClick(record, e) {
        const self = this;
        const id = record.id;
        switch (e.key) {
            case '1': //修改
                let updateStatus = true;
                let SelectedPasswayIds = record.passwayIds || ''
                let SelectedAcctype = (record.acctype !== undefined) ? String(record.acctype) : undefined
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

    handlerSelect(limit = 10, offset = 1, name, linkman, lkmphone, region) {
        this.setState({
            loading: true
        });
        axios.get('/back/merchantinfoController/page', {
            params: {
                limit,
                offset,
                name,
                linkman,
                lkmphone,
                region
            }
        }).then((resp) => {
            const dataSource = resp.data.rows;
            const total = resp.data.total;
            this.setState({
                dataSource: sloveRespData(dataSource, 'id'),
                loading: false,
                current: offset,
                total
            })
        })
    }

    handlerAdd(params) {
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({}, tabInfos, params)
        if (params.region && Array.isArray(params.region)) {
            let params = options.region.join(',')
            options['region'] = params
        }

        if (params.passwayIds && Array.isArray(params.passwayIds)) {
            let params = options.passwayIds.join(',')
            options['passwayIds'] = params
        }

        if (options.buslicence) {
            options['buslicence'] = options.buslicence.file.response.msg
        }

        if (options.orgcode) {
            console.log('front')
            options['orgcode'] = options.orgcode.file.response.msg
        }

        if (options.lawholder) {
            options['lawholder'] = options.lawholder.file.response.msg
        }

        if (options.front) {
            options['front'] = options.front.file.response.msg
        }

        if (options.back) {
            options['back'] = options.back.file.response.msg
        }

        if (options.frontid) {
            options['frontid'] = options.frontid.file.response.msg
        }

        if (options.backid) {
            options['backid'] = options.backid.file.response.msg
        }

        if (options.spequalifione) {
            options['spequalifione'] = options.spequalifione.file.response.msg
        }

        if (options.spequalifitwo) {
            options['spequalifitwo'] = options.spequalifitwo.file.response.msg
        }

        if (options.spequalifithree) {
            options['spequalifithree'] = options.spequalifithree.file.response.msg
        }

        if (options.spequalififour) {
            options['spequalififour'] = options.spequalififour.file.response.msg
        }

        if (options.spequalififive) {
            options['spequalififive'] = options.spequalififive.file.response.msg
        }

        axios.post(`/back/merchantinfoController/save `, options).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if (data.rel) {
                this.setState({
                    confirmLoading: false,
                    visible: false
                })
                message.success('新增成功')
                this.handlerSelect()
                this.refs.form.resetFields()
            } else {
                this.setState({
                    confirmLoading: false,
                })
                message.error(data.msg)
            }
        })
    }

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

    handleUpdate(params) {
        params.id = this.state.tabInfos.id
        const options = params;
        if (options.passwayIds) {
            options.passwayIds = options.passwayIds.join(',');
        }
        if (options.region) {
            options.region = options.region.join(',')
        }

        if (options.front && options.front.file !== undefined) {
            options['front'] = options.front.file.response.msg
        }

        if (options.back && options.back.file !== undefined) {
            options['back'] = options.back.file.response.msg
        }

        if (options.frontid && options.frontid.file !== undefined) {
            options['frontid'] = options.frontid.file.response.msg
        }

        if (options.backid && options.backid.file !== undefined) {
            options['backid'] = options.backid.file.response.msg
        }

        if (options.orgcode && options.orgcode.file !== undefined) {
            options['orgcode'] = options.orgcode.file.response.msg
        }

        if (options.buslicence && options.buslicence.file !== undefined) {
            options['buslicence'] = options.buslicence.file.response.msg
        }

        if (options.lawholder && options.lawholder.file !== undefined) {
            options['lawholder'] = options.lawholder.file.response.msg
        }

        if (options.spequalifione && options.spequalifione.file !== undefined) {
            options['spequalifione'] = options.spequalifione.file.response.msg
        }

        if (options.spequalifitwo && options.spequalifitwo.file !== undefined) {
            options['spequalifitwo'] = options.spequalifitwo.file.response.msg
        }

        if (options.spequalifithree && options.spequalifithree.file !== undefined) {
            options['spequalifithree'] = options.spequalifithree.file.response.msg
        }

        if (options.spequalififour && options.spequalififour.file !== undefined) {
            options['spequalififour'] = options.spequalififour.file.response.msg
        }

        if (options.spequalififive && options.spequalififive.file !== undefined) {
            options['spequalififive'] = options.spequalififive.file.response.msg
        }
        axios.put(`/back/merchantinfoController/update/${options.id}`, options).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('修改成功')
                this.handlerSelect()
                this.handlerHideModal()
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
                visible: true,
                modalTitle: '修改-商户基本信息',
                isUpdate: true
            });
        } else {
            this.setState({
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

    handlerImportHider = (e) => {
        this.setState({
            importVisible: false
        })
    }

    handlerModalOk = (err, fieldsValue) => {
        const isUpdate = this.state.isUpdate;
        this.refs.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({
                confirmLoading: true
            })
            let values = null;
            if (fieldsValue.idendtstart && fieldsValue.idendtend) {
                values = {
                    ...fieldsValue,
                    idendtstart: fieldsValue['idendtstart'].format('YYYY-MM-DD'),
                    idendtend: fieldsValue['idendtend'].format('YYYY-MM-DD')
                }
            } else {
                values = {
                    ...fieldsValue
                }
            }
            console.log(values)
            if (isUpdate) {
                this.handleUpdate(values)
            } else {
                this.handlerAdd(values)
            }
        });
    }


    handlerImportOk = (err, values) => {
        this.refs.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                this.handlerImportHider()
            }
        })
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            console.log(values)
            const limit = 10,
                offset = 1,
                name = values.merchantName,
                linkman = values.linkman,
                lkmphone = values.lkmphone,
                region = values.region === undefined ? '' : values.region.join(',');
            this.setState({
                searchParams: {
                    name,
                    linkman,
                    lkmphone,
                    region
                }
            })
            this.handlerSelect(limit, offset, name, linkman, lkmphone, region)
        })
    }

    handlerTableChange = (pageSize, current) => {
        console.log(pageSize, current)
        this.handlerSelect(current, pageSize, ...this.state.searchParams)
    }

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize
        })
        this.handlerSelect(pageSize, current, ...this.state.searchParams)
    }

    /**
     * 支付通知二维码
     */
    setQrModalVisible = (modalVisible) => {
        this.setState({
            qrVisible: modalVisible,
            spinLoading: true
        })
    }
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = {
            defaultPageSize,
            current: this.state.current,
            total: this.state.total,
            onChange: this.handlerTableChange,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            showTotal: (total, range) => `共${total}条数据`,
            showQuickJumper: true
        }
        return (
            <div className="merchant-wrapper">
                <BreadcrumbCustom first="机构信息" second="商户" location={this.props.location} />
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}>
                    <MerchantHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                    <div style={{ float: 'right' }}>
                        <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                        <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                    </div>
                </Card>
                <Row>
                    {/* 导入商户 */}
                    <Col span={24}>
                        <Modal
                            title="批量导入商户基本信息"
                            wrapClassName="vertical-center-modal"
                            onOk={this.handlerImportOk}
                            onCancel={this.handlerImportHider}
                            visible={this.state.importVisible}
                            footer={null}
                        >
                            <BulkImport />
                        </Modal>
                    </Col>
                </Row>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
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
                        </Col>
                    </Row>
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                rowSelection={rowSelection}
                                columns={this.state.columns}
                                dataSource={this.state.dataSource}
                                pagination={pagination}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {/* 商户信息模态框 */}
                            <Modal
                                maskClosable={false}
                                wrapClassName="vertical-center-modal"
                                title={this.state.modalTitle}
                                onOk={this.handlerModalOk}
                                onCancel={this.handlerHideModal}
                                visible={this.state.visible}
                                width={855}
                                confirmLoading={this.state.confirmLoading}
                            >
                                <MerchantModal
                                    ref="form"
                                    onSubmit={this.handlerModalOk}
                                    passway={this.state.passway}
                                    tabInfos={this.state.tabInfos}
                                    isUpdate={this.state.isUpdate}
                                    SelectedPasswayIds={this.state.SelectedPasswayIds}
                                    SelectedAcctype={this.state.SelectedAcctype}
                                    handlePaySelectChange={(value) => { this.setState({ SelectedPasswayIds: value }) }}
                                    handleTypeChange={(value) => { this.setState({ SelectedAcctype: value }) }}
                                />
                            </Modal>
                        </Col>
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
