import React from 'react'
import axios from 'axios'
import { Row, Col, Button, Card, Table, Modal, Icon, message } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import TerminalModal from "./terminalModal";
import TerminalHeader from './TerminalHeader'
import DropOption from '@/components/DropOption'
import { sloveRespData } from '@/utils/index'
import { paginat } from '@/utils/pagination'

const confirm = Modal.confirm
class equipTerminal extends React.Component {
    state = {
        //分页
        pageSize: 10,                          //每页信息条数
        current: 1,
        total: 0,

        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        passway: [],
        modalTitle: '新增-设备终端信息',
        isUpdate: false,
        updateData: {},
    };
    componentWillMount() {
        this.handlerSelect();
        this._getPassWay()
    }

    handlerSelect(limit = 10, offset = 1, params) {
        this.setState({
            loading: true
        })
        axios.get('/back/terminal/terminals', {
            params: {
                limit,
                offset,
                ...params
            }
        }).then((resp) => {
            const dataSource = resp.data.rows,
                total = resp.data.total;
            this.setState({
                dataSource: sloveRespData(dataSource, 'id'),
                loading: false,
                current: offset,
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
            let updateState = true;
            this.showModal(updateState)
            this.setState({
                updateData: record,
                isUpdate: true
            })
            // 删除
        } else if (e.key === '2') {
            const id = record.id;
            self.handleDelete(id)
        }
    }

    handlerAdd(options) {
        const tabInfos = this.state.updateData;
        const params = Object.assign({}, tabInfos, options)
        const newParams = {
            desc: params.desc,
            terminalName: params.terminalName,
            merchantId: params.merchantId,
            no: params.no,
            deviceId: params.deviceId,
            idcode: params.idcode
        }
        console.log(newParams)
        axios.post(`/back/terminal/terminal`, newParams)
            .then((resp) => {
                console.log(resp.data)
                const data = resp.data;
                if (data.rel) {
                    message.success('添加成功')
                    this.handlerSelect()
                }
            });
    }

    handleUpdate(options) {
        const tabInfos = this.state.updateData;
        const params = Object.assign({}, tabInfos, options)
        axios.put(`/back/terminal/${params.id}`, {
            desc: params.desc,
            terminalName: params.terminalName,
            merchantId: params.merchantId,
            no: params.no,
            deviceId: params.deviceId,
            idcode: params.idcode,
        }).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('修改成功')
                this.handlerSelect()
            } else {
                message.error(data.msg)
            }
        })
    }

    handleDelete(id) {
        if (id) {
            confirm({
                title: '确定要删除吗?',
                onOk: () => {
                    axios.delete(`/back/terminal/remove/${id}`).then(res => {
                        if (res.data.rel) {
                            this.handlerSelect()
                            message.success('删除成功')
                        } else {
                            message.error(res.data.msg)
                        }
                    })
                },
            })
            return
        }
        const keys = this.state.selectedRowKeys;
        let url = [], self = this;
        keys.forEach((item) => {
            url.push(axios.delete(`/back/terminal/remove/${item}`))
        })
        confirm({
            title: '确定要删除吗?',
            onOk() {
                axios.all(url).then(axios.spread((acc, pers) => {
                    if (acc.data.rel) {
                        message.success('删除成功')
                        self.handlerSelect()
                    }
                }))
            },
        })
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            const limit = this.state.pageSize,
                offset = 1;
            this.setState({
                searchParams: values
            })
            this.handlerSelect(limit, offset, values)
        })
    }

    handlerHideModal = (e) => {
        this.setState({
            visible: false
        })
        this.refs.form.resetFields()
    }

    handlerModalOk = (err, values) => {
        const isUpdate = this.state.isUpdate;
        this.refs.form.validateFields((err, values) => {
            if (err) return;
            if (isUpdate) {
                this.handleUpdate(values)
            } else {
                this.handlerAdd(values)
            }
            if (!err) {
                this.handlerHideModal()
                this.refs.form.resetFields()
            }
        });
    }
    showModal(status) {
        if (status) {
            this.setState({
                visible: true,
                modalTitle: '修改-设备终端信息'
            });
        } else {
            this.setState({
                visible: true,
                modalTitle: '新增-设备终端信息',
                updateData: {},
                isUpdate: false
            });
        }
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };


    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.handlerSelect(pageSize, current, searchParams)
        })
        const columns = [
            {
                title: '序号',
                dataIndex: 'order_id',
                render: (text, record) => <a href={record.url} target="_blank">{text}</a>
            }, {
                title: '设备终端名称',
                dataIndex: 'terminalName',
            }, {
                title: '商户名称',
                dataIndex: 'merchantName',
            }, {
                title: '设备条码',
                dataIndex: 'no',
            }, {
                title: '设备品类',
                dataIndex: 'deviceName',
            }, {
                title: '设备备注',
                dataIndex: 'desc',
            }, {
                title: '创建人',
                dataIndex: 'createPerson',
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
            }, {
                title: '修改人',
                dataIndex: 'changePerson',
            }, {
                title: '修改时间',
                dataIndex: 'changeTime'
            }, {
                title: '操作',
                dataIndex: 'action',
                width: 80,
                fixed: 'right',
                render: (text, record) => {
                    return <DropOption
                        onMenuClick={e => this.handleMenuClick(record, e)}
                        menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]}
                    />
                }
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="设备管理" second="设备终端" location={this.props.location} />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <div>
                        <TerminalHeader
                            ref="normalForm"
                            onSubmit={this.handlerNormalForm}
                            passway={this.state.passway}
                        />
                    </div>
                    <div style={{ float: 'right', marginRight: 55 }}>
                        <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                        <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                    </div>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row>
                        <Col span={24} style={{ marginLeft: 14 }}>
                            <Button
                                type="primary"
                                onClick={() => { this.showModal() }}
                                className="btn-add"
                                size="large"
                                shape="circle"
                                icon="plus">
                            </Button>
                            <Button
                                onClick={() => { this.handleDelete() }}
                                disabled={selectedRowKeys.length > 0 ? false : true}
                                className="btn-delete"
                                type="primary"
                                size="large"
                                shape="circle"
                                icon="delete" >
                            </Button>
                        </Col>
                    </Row>
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={855}>
                        <TerminalModal ref="form" onSubmit={this.handlerModalOk} tabInfos={this.state.updateData} />
                    </Modal>
                    <Row style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <Table
                                scroll={{ x: '150%' }}
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

export default equipTerminal
