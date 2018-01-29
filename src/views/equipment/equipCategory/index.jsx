import React from 'react'
import axios from 'axios'
import { Row, Col, Button, Card, Table, Modal, Icon, message } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import CategoryModal from "./CategoryModal";
import CategoryHeader from './CategoryHeader'
import DropOption from '@/components/DropOption'
import { sloveRespData } from '@/utils/index'
import '@/style/sharebenefit/reset-antd.less'
import { paginat } from '@/utils/pagination'

const confirm = Modal.confirm
class equipCategory extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        updateData: {},
        passway: [],
        modalTitle: '新增-设备品类信息',
        isUpdate: false,
        current: 1,
        total: '',
        searchParams: undefined,                 //查询参数
        pageSize: 10,                            //每页信息条数
    };
    componentWillMount() {
        this.handlerSelect();
        this._getPassWay()
    }
    /**
     * 获取表格数据
     * 
     * @param {*} limit 
     * @param {*} offset 
     * @param {*} params 
     */
    handlerSelect(limit = 10, offset = 1, params) {
        this.setState({
            loading: true
        })
        axios.get('/back/device/page', {
            params:{
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
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({}, options, tabInfos)
        const newParams = {
            deviceName: params.deviceName,
        }
        axios.post(`/back/device/device`, newParams)
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
        axios.put(`/back/device/${params.id}`, {
            "deviceName": params.deviceName
        })
            .then((resp) => {
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
                    axios.delete(`/back/device/remove/${id}`).then(res => {
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
            url.push(axios.delete(`/back/device/remove/${item}`))
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
            if (err) return
            this.setState({ searchParams: values })
            this.handlerSelect(this.state.pageSize, 1, values)
        })
    }

    handlerModalOk = (err, values) => {
        const isUpdate = this.state.isUpdate;
        console.log(isUpdate)
        this.refs.form.validateFields((err, values) => {
            if (err) return;
            console.log(values)
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
    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
        this.refs.form.resetFields()
    }

    showModal(status) {
        if (status) {
            this.setState({
                visible: true,
                modalTitle: '修改-设备品类信息'
            });
        } else {
            this.setState({
                visible: true,
                modalTitle: '新增-设备品类信息',
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
        const columns = [
            {
                title: '序号',
                dataIndex: 'order_id',
                render: (text, record) => <a href={record.url} target="_blank">{text}</a>
            }, {
                title: '设备品类名称',
                dataIndex: 'deviceName',
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
                dataIndex: 'lastEdittime'
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => {
                    return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
                }
            }
        ]
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.handlerSelect(pageSize, current, searchParams)
        })
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="设备管理" second="设备品类信息" location={this.props.location} />
                <Card bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <Row>
                        <Col span={12}>
                            <CategoryHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                        </Col>
                        <Col span={12}>
                            <div style={{ float: 'right' }}>
                                <Button type="primary" onClick={this.handlerNormalForm} className="btn-search">查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>

                </Card>
                <Card className="terminal-main-table" style={{ marginTop: 16 }} bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row gutter={40}>
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
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={520}>
                        <CategoryModal ref="form" onSubmit={this.handlerModalOk} passway={this.state.passway} tabInfos={this.state.updateData} />
                    </Modal>
                    <Row style={{ marginTop: 16 }}>
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
                </Card>
            </div>
        )
    }
}

export default equipCategory
