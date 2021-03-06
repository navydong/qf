import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux';
import { Row, Col, Button, Card, Table, Modal, Icon, message } from 'antd'
import DropOption from '@/components/DropOption'
import ServiceModal from "./ServiceModal";
import ServiceHeader from './ServiceHeader'
import "../merchant.less"
import { paginat } from '@/utils/pagination'

const confirm = Modal.confirm
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
class Service extends React.Component {
    _isMounted = false
    state = {
        pageSize: 10,                           //分页大小
        current: 1,                             //当前也是
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        passway: [],
        total: '',
        modalTitle: '新增-服务商信息',
        isUpdate: false,
        tabInfos: {},
        searchParams: {},                       //查询参数
        confirmLoading: false,                  //模态框确认按钮loading
        SelectedPasswayIds: [],                 //当前选中的支付通道
        SelectedAcctype: '',                    //当前选中的账户类型
        modalRandomKey: -1,
    };

    componentDidMount() {
        this._isMounted = true
        this.handlerSelect();
        this._getPassWay()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    /**
     * 表格数据查询
     * 
     * @param {number} [limit=10] 
     * @param {number} [offset=1] 
     * @param {any} orgName 
     * @memberof Service
     */
    handlerSelect(limit = 10, offset = 1, param) {
        this.setState({
            loading: true
        })
        axios.get('/back/facilitator/findFacilitators', {
            params: {
                limit,
                offset,
                ...param
            }
        }).then((resp) => {
            const total = resp.data.total;
            this._isMounted && this.setState({
                dataSource: setKey(resp.data.rows),
                loading: false,
                current: offset,
                total,
            })
        })
    }
    _getPassWay() {
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this._isMounted && this.setState({
                passway
            })
        })
    }
    handleMenuClick(record, e) {
        const self = this;
        if (e.key === '1') {
            console.log(record)
            let updateStatus = true;
            let SelectedPasswayIds = record.passwayIds || ''
            let SelectedAcctype = (record.acctype !== undefined) ? String(record.acctype) : undefined
            this.setState({
                tabInfos: record,
                SelectedPasswayIds,
                SelectedAcctype,
            })
            this.showModal(updateStatus)
        } else if (e.key === '2') {
            const arr = [];
            const id = record.id;
            arr.push(id)
            this.setState({ selectedRowKeys: arr })
            self.handleDelete(id)
        }
    }
    /**
     * 
     * 
     * @param {any} params 
     * @memberof Service
     */
    handlerAdd(params) {
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({}, tabInfos, params)
        if (options.passwayIds && Array.isArray(options.passwayIds)) {
            let params = options.passwayIds.join(',')
            options['passwayIds'] = params
        }
        axios.post(`/back/facilitator/saveAndUpload`, options).then((resp) => {
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
    /**
     * 删除
     * 
     * @param {any} id 
     * @memberof Service
     */
    handleDelete(id) {
        const self = this;
        if (id) {
            confirm({
                title: '确定要删除吗?',
                onOk() {
                    axios.delete(`/back/facilitator/remove/${id}`).then((res) => {
                        if (res.data.rel) {
                            message.success('删除成功')
                            self.handlerSelect()
                        } else {
                            message.error(res.data.msg)
                        }
                    })
                },
            })
            return;
        }
        const keys = this.state.selectedRowKeys;
        let url = [];
        keys.forEach((item) => {
            url.push(axios.delete(`/back/facilitator/remove/${item}`))
        })
        confirm({
            title: '确定要删除吗?',
            onOk() {
                axios.all(url).then(axios.spread((acc, pers) => {
                    debugger
                    if (acc.data.rel) {
                        message.success('删除成功')
                        self.handlerSelect()
                    }
                }))
            },
        })
    }

    handleUpdate(params) {
        const { pageSize, current, searchParams } = this.state
        params.id = this.state.tabInfos.id
        const options = params
        delete options.passwayNames
        if (options.passwayIds && Array.isArray(options.passwayIds)) {
            options['passwayIds'] = options.passwayIds.join(',');
        }
        axios.put(`/back/facilitator/updateInfo`, options).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                this.setState({
                    confirmLoading: false,
                    visible: false
                })
                message.success('修改成功')
                this.handlerSelect(pageSize, current, searchParams)
                this.refs.form.resetFields()
            } else {
                this.setState({
                    confirmLoading: false,
                })
                message.error(data.msg)
            }
        })
    }

    showModal(status) {
        if (status) {
            this.setState({
                modalRandomKey: Math.random(),
                visible: true,
                modalTitle: '修改-服务商信息',
                isUpdate: true
            });
        } else {
            this.setState({
                modalRandomKey: Math.random(),
                visible: true,
                modalTitle: '新增-服务商信息',
                isUpdate: false,
                tabInfos: {},
                SelectedPasswayIds: '',
                SelectedAcctype: '',
            });
        }
    }

    handlerHideModal = (e) => {
        this.setState({
            visible: false
        })
        this.refs.form.resetFields()
    }

    handlerModalOk = (err, fieldsValue) => {
        const isUpdate = this.state.isUpdate;
        this.refs.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (err) return;
            this.setState({
                confirmLoading: true
            })
            let values = null;
            if (fieldsValue.idendtstart && fieldsValue.idendtend) {
                values = {
                    ...fieldsValue,
                    'idendtstart': fieldsValue['idendtstart'].format('YYYY-MM-DD'),
                    'idendtend': fieldsValue['idendtend'].format('YYYY-MM-DD')
                }
            } else {
                values = {
                    ...fieldsValue
                }
            }
            if (isUpdate) {
                this.handleUpdate(values)
            } else {
                this.handlerAdd(values)
            }
        });
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }
    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            const { pageSize } = this.state,
                offset = 1;
            this.setState({
                searchParams: values
            })
            this.handlerSelect(pageSize, offset, values)
        })
    }
    permission = () => {
        const url = window.location.origin + '/back/wxwallet/authpage'
        window.open(url)
    }
    hasPermissions = false;
    render() {
        const columns = [
            {
                title: '服务商名称',
                dataIndex: 'facname',
            }, {
                title: '服务商简称',
                dataIndex: 'facstname',
            }, {
                title: '可用通道',
                dataIndex: 'passwayNames',
            }, {
                //isAuthorize   0代表否,1代表是
                title: '第三方平台授权',
                dataIndex: 'isAuthorize',
                render: (text) => {
                    if (text === 1) {
                        return '已授权'
                    } else {
                        return '未授权'
                    }
                }
            }, {
                title: '创建人',
                dataIndex: 'creatorId',
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
            }, {
                title: '修改人',
                dataIndex: 'lastEditorid',
            }, {
                title: '修改时间',
                dataIndex: 'lastEdittime',
            }, {
                title: '操作',
                dataIndex: 'action',
                fixed: 'right',
                width: 72,
                render: (text, record) => (
                    <DropOption
                        onMenuClick={e => this.handleMenuClick(record, e)}
                        menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]}
                    />
                )
            }
        ]
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.handlerSelect(pageSize, current, searchParams)
        })
        const { orgType, orgLevel } = this.props.current
        // console.log(orgType, orgLevel)
        // 机构类型, 暂时无用
        // 机构类型 1 和 0 有权限修改
        if (orgType) {
            if (orgLevel === '0' || orgLevel === '1') {
                this.hasPermissions = true
            }
        }

        return (
            <div className="terminal-wrapper">
                <Card className="terminal-top-form" bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <Row gutter={12}>
                        <Col>
                            <ServiceHeader
                                ref="normalForm"
                                onSubmit={this.handlerNormalForm}
                                passway={this.state.passway}
                            />
                            <div className="fr">
                                <Button
                                    type="primary"
                                    onClick={this.handlerNormalForm}
                                    className="btn-search"
                                    loading={this.state.loading}
                                >查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row gutter={12}>
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
                            {
                                this.hasPermissions
                                    ? <Button
                                        title="第三方平台授权"
                                        onClick={this.permission}
                                        className="btn-limit"
                                        type="primary"
                                        size="large"
                                        shape="circle"
                                        icon="book"
                                    />
                                    : null
                            }
                        </Col>
                    </Row>
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
                        <ServiceModal
                            ref="form"
                            wrapClassName="vertical-center-modal"
                            onSubmit={this.handlerModalOk}
                            passway={this.state.passway}
                            isUpdate={this.state.isUpdate}
                            tabInfos={this.state.tabInfos}
                            SelectedPasswayIds={this.state.SelectedPasswayIds}
                            SelectedAcctype={this.state.SelectedAcctype}
                            handlePaySelectChange={(value) => { this.setState({ SelectedPasswayIds: value }) }}
                            handleTypeChange={(value) => { this.setState({ SelectedAcctype: value }) }}
                        />
                    </Modal>
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                scroll={{ x: true }}
                                rowSelection={rowSelection}
                                columns={columns}
                                rowKey="id"
                                dataSource={this.state.dataSource}
                                pagination={pagination}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        current: state.userInfo.data,
    }
}
export default connect(mapStateToProps)(Service);
