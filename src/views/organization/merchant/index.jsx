import React from 'react'
import axios from 'axios'
import QRCode from 'qrcode'  //https://github.com/soldair/node-qrcode
import { Row, Col, Button, Card, Table, Modal, Spin, message } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import MerchantModal from './MerchantModal'
import MerchantHeader from './MerchantHeader'
import BulkImport from './BulkImport'
import DropOption from '@/components/DropOption'
import { sloveRespData } from '@/utils/index'
import { paginat } from '@/utils/pagination'
import "../merchant.less"

const confirm = Modal.confirm
const defaultPageSize = 10;

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
    return data
}


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
    }
    componentWillMount() {
        this.handlerSelect();
        this._getPassWay();
        this.selectMerchant();
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
            const dataSource = setKey(resp.data.rows);
            const total = resp.data.total;
            this.setState({
                dataSource,
                loading: false,
                current: offset,
                total
            })
        })
    }
    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            this.setState({
                searchParams: values
            })
            this.handlerSelect(this.state.pageSize, 1, values)
        })
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


    handlerAdd(params) {
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({}, tabInfos, params)

        if (params.region) {
            options.region = options.region.join(',')
        }
        if (params.passwayIds) {
            options.passwayIds = options.passwayIds.join(',')
        }
        // 图片处理，提交上传的路径
        ['buslicence', 'orgcode', 'lawholder', 'front', 'back', 'frontid', 'backid', 'spequalifione', 'spequalifitwo', 'spequalifithree', 'spequalififour', 'spequalififive'].forEach((optionsName) => {
            if (options[optionsName]) {
                options[optionsName] = options[optionsName].file.response.msg
            }
        })
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
        ['buslicence', 'orgcode', 'lawholder', 'front', 'back', 'frontid', 'backid', 'spequalifione', 'spequalifitwo', 'spequalifithree', 'spequalififour', 'spequalififive'].forEach((optionsName) => {
            if (options[optionsName]) {
                options[optionsName] = options[optionsName].file.response.msg
            }
        })
        axios.put(`/back/merchantinfoController/update/${options.id}`, options).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('修改成功')
                this.handlerSelect()
                this.handlerHideModal()
                // 更新上级商户
                this.selectMerchant()
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

    handlerModalOk = () => {
        const isUpdate = this.state.isUpdate;
        this.refs.form.validateFields((err, fieldsValue) => {
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

    handlerTableChange = (pageSize, current) => {
        console.log(pageSize, current)
        this.handlerSelect(current, pageSize, this.state.searchParams)
    }

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize
        })
        this.handlerSelect(pageSize, current, this.state.searchParams)
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
    /**
     * 商户信息zip下载
     */
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
    * 
    * @param {*} res 
    */
    formCascaderData(res, label) {
        (function d(s) {
            s.forEach(item => {
                item.value = item.id
                item.label = item[label]
                if (item.children) {
                    d(item.children)
                }
            })
        })(res)
        return setKey(res)
    }
    //上级商户
    selectMerchant() {
        axios.get(`/back/merchantinfoController/page?limit=100&offset=1`).then((resp) => {
            const merchant = this.formCascaderData(resp.data.rows, 'merchantName');
            this.setState({
                merchant
            })
        })
    }
    render() {
        const columns = [
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
                <BreadcrumbCustom first="机构信息" second="商户" location={this.props.location} />
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}>
                    <MerchantHeader
                        ref="normalForm"
                        onSubmit={this.handlerNormalForm}
                        passway={this.state.passway}
                    />
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
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
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
