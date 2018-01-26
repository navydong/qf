import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux';
import { Row, Col, Button, Card, Table, Modal, message } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import SloveHeader from './SloveHeader'
import SloveModal from "./SloveModal";
import DropOption from '@/components/DropOption/DropOption'
import '../merchant.less'
import { paginat } from '@/utils/pagination'

const confirm = Modal.confirm
class Slove extends React.Component {
    state = {
        pageSize: 10,                       //分页大小
        offset: 1,                          //分页当前第几页
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        visible1: false,
        passway: [],
        total: '',
        modalTitle: '新增-受理机构信息',
        isUpdate: false,
        tabInfos: {},
        searchParams: {},                   //查询参数
        confirmLoading: false,              //模态框确定按钮
        SelectedPasswayIds: "",             //当前选中的支付通道
        SelectedAcctype: '',                //当前选中的账户类型
    };

    componentWillMount() {
        this.handlerSelect();
        this._getPassWay();
    }
    /**
 * 查询表格数据
 * 
 * @param {*} limit 
 * @param {*} offset 
 * @param {*} params 查询参数 
 */
    handlerSelect(limit = 10, offset = 1, params) {
        this.setState({
            loading: true
        })
        axios.get('/back/accepagent/findAccepagents', {
            params: {
                limit,
                offset,
                ...params
            }
        }).then((resp) => {
            const dataSource = this.sloveRespData(resp.data.rows, 'id'),
                total = resp.data.total;
            this.setState({
                dataSource,
                current: offset,
                loading: false,
                total
            })
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
        // 修改
        if (e.key === '1') {
            console.log(record)
            let updateStatus = true;
            // String
            let SelectedPasswayIds = record.passwayIds || ''
            let SelectedAcctype = (record.acctype !== undefined) ? String(record.acctype) : undefined
            this.setState({
                tabInfos: record,
                SelectedPasswayIds,
                SelectedAcctype,
            })
            this.showModal(updateStatus)
            // 删除
        } else if (e.key === '2') {
            //删除按钮
            Modal.confirm({
                title: '确认删除?',
                onOk: () => {
                    axios.delete(`/back/accepagent/remove/${record.id}`).then(res => res.data).then(res => {
                        if (res.rel) {
                            message.success('删除成功')
                            this.handlerSelect()
                        } else {
                            message.error(res.msg)
                        }
                    })
                }
            })
        }
    }

    sloveRespData = (dataSource, key) => {
        console.log(key)
        if (!dataSource) return;
        dataSource.forEach((item, index) => {
            item.keys = item.key;
            item.key = item[key];
            item['order_id'] = index + 1;
        })

        return dataSource;
    }

    handlerAdd(params) {
        const options = params;
        if (options.passwayIds && Array.isArray(options.passwayIds)) {
            let params = options.passwayIds.join(',')
            options['passwayIds'] = params
        }

        if (options.cert) {
            options['cert'] = options.cert.file.response.msg
        }

        if (options.front) {
            console.log('front')
            options['front'] = options.front.file.response.msg
        }

        if (options.back) {
            options['back'] = options.back.file.response.msg
        }
        axios.post(`/back/accepagent/saveAndUpload`, options).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if (data.rel) {
                this.setState({
                    confirmLoading: false,
                    visible: false
                })
                message.success('添加成功')
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
        const keys = this.state.selectedRowKeys;
        let url = [];
        keys.forEach((item) => {
            url.push(axios.delete(`/back/accepagent/remove/${item}`))
        })
        confirm({
            title: '确定要删除吗?',
            onOk() {
                axios.all(url).then(axios.spread((acc, pers) => {
                    if (acc.data.rel) {
                        message.success('删除成功')
                        self.handlerSelect()
                    } else {
                        message.error(acc.data.msg)
                    }
                }))
            },
        })
    }

    handleUpdate(params) {
        let options = params
        options.id = this.state.tabInfos.id
        if (options.passwayIds && Array.isArray(options.passwayIds)) {
            options['passwayIds'] = options.passwayIds.join(',');
        }

        if (options.cert && options.cert.file !== undefined) {
            console.log(options.cert)
            options['cert'] = options.cert.file.response.msg
        }

        if (options.front && options.front.file !== undefined) {
            console.log('front')
            options['front'] = options.front.file.response.msg
        }

        if (options.back && options.back.file !== undefined) {
            options['back'] = options.back.file.response.msg
        }

        axios.put(`/back/accepagent/updateInfo`, options).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('修改成功')
                this.handlerSelect()
                this.setState({
                    confirmLoading: false,
                    visible: false
                })
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
                visible: true,
                modalTitle: '修改-受理机构信息',
                isUpdate: true
            });
        } else {
            this.setState({
                visible: true,
                modalTitle: '新增-受理机构信息',
                isUpdate: false,
                tabInfos: {},
                SelectedPasswayIds: '',
                SelectedAcctype: '',
            });
        }
    }
    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
        this.refs.form.resetFields()
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
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }
    /**
     * 查询按钮
     */
    handlerHeaderForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            this.setState({
                searchParams: values
            })
            this.handlerSelect(this.state.pageSize, 1, values)
        })
    }

    handlerClear = () => {
        this.refs.form.resetFields();
    }
    /**
     * 第三方平台授权权限
     */
    permission = () => {
        const url = window.location.origin + '/back/wxwallet/authpage'
        window.open(url)
    }
    // 是否有第三方平台授权权限
    hasPermissions = false;
    render() {
        const { selectedRowKeys } = this.state;
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
        const columns = [
            {
                title: '受理机构名称',
                dataIndex: 'orgname',
            }, {
                title: '受理机构简称',
                dataIndex: 'orgstname',
            }, {
                title: '可用通道',
                dataIndex: 'passwayNames',
            }, {
                title: '第三方平台授权',         //isAuthorize   0代表否,1代表是
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
                dataIndex: 'lastEdittime'
            }, {
                title: '操作',
                dataIndex: 'action',
                width: 80,
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <DropOption
                            onMenuClick={e => this.handleMenuClick(record, e)}
                            menuOptions={[
                                { key: '1', name: '修改' },
                                { key: '2', name: '删除' }
                            ]}
                        />
                    )
                }
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="机构管理" second="受理机构信息" location={this.props.location} />
                <Card
                    className="terminal-top-form"
                    bordered={false}
                    bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                    noHovering
                >
                    <Row gutter={12}>
                        <Col>
                            <SloveHeader
                                ref="normalForm"
                                onSubmit={this.handlerHeaderForm}
                                passway={this.state.passway}
                            />
                            <div className='fr'>
                                <Button type="primary" onClick={this.handlerHeaderForm} className={'btn-search'}>查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button
                                type="primary"
                                onClick={() => { this.showModal() }}
                                className="btn-add"
                                size="large"
                                shape="circle"
                                icon="plus"
                            />
                            <Button
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
                        wrapClassName="vertical-center-modal"
                        title={this.state.modalTitle}
                        onOk={this.handlerModalOk}
                        onCancel={this.handlerHideModal}
                        visible={this.state.visible}
                        afterClose={this.handlerClear}
                        width={855}
                        maskClosable={false}
                        confirmLoading={this.state.confirmLoading}
                    >
                        <SloveModal
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
                    <Row style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                scroll={{ x: '130%' }}
                                rowSelection={rowSelection}
                                columns={columns}
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
        current: state.httpData.user.data,
    }
}
export default connect(mapStateToProps)(Slove);