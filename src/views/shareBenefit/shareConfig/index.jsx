import React from 'react'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import DropOption from '@/components/DropOption'
import { Row, Col, Button, Card, Table, Modal, message } from 'antd'
import axios from 'axios'
import ConfigModal from "./shareConfigModal";
import ConfigHeader from './ConfigHeader'
import { sloveRespData } from '@/utils/index'
import '@/style/sharebenefit/reset-antd.less'
import { paginat } from '@/utils/pagination'

const confirm = Modal.confirm
class ShareConfig extends React.Component {
    _isMounted = false
    state = {
        pageSize: 10,                   //分页大小
        current: 1,                     //当前页码
        searchParams: undefined,        //查询参数
        total: 0,                       //数据总条数
        loading: false,
        visible: false,
        isUpdate: false,
        selectedRowKeys: [],  // Check here to configure the default column
        dataSource: [],
        modalTitle: '新增-机构分润配置',
        tabInfos: {},
        scheme: []
    };
    componentDidMount() {
        this._isMounted = true;
        this.handlerSelect();
        this.selectScheme();
    }
    componentWillUnmount() {
        this._isMounted = false
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
        axios.get('/back/splitScheme/splitchemes', {
            params: {
                limit,
                offset,
                ...params
            }
        }).then((resp) => {
            const dataSource = resp.data.rows,
                total = resp.data.total;
            this._isMounted && this.setState({
                dataSource: sloveRespData(dataSource, 'id'),
                loading: false,
                current: offset,
                total
            })
        })
    }

    handleMenuClick(record, e) {
        const self = this;
        if (e.key === '1') {
            //修改
            let updateStatus = true;
            this.setState({ isUpdate: true, tabInfos: record })
            this.showModal(updateStatus)
        } else if (e.key === '2') {
            // 删除
            const id = record.id;
            self.handleDelete(id)
        }
    }



    handleDelete(id) {
        if (id) {
            confirm({
                title: '确定要删除吗?',
                onOk: () => {
                    axios.delete(`/back/splitScheme/remove/${id}`).then((res) => {
                        if (res.data.rel) {
                            message.success('删除成功')
                            this.handlerSelect()
                        } else {
                            message.error(res.data.msg, 5)
                        }
                    })
                },
            })
            return
        }
        const keys = this.state.selectedRowKeys;
        let url = [], self = this;
        keys.forEach((item) => {
            url.push(axios.delete(`/back/splitScheme/remove/${item}`))
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

    handleUpdate(options) {
        const { pageSize, current, searchParams, tabInfos } = this.state;
        const params = Object.assign({}, tabInfos, options)
        axios.put(`/back/splitScheme/${params.id}`, {
            sorgId: params.sorgId,
            ptype: params.ptype,
            stype: params.stype,
            schemeId: params.schemeId
        }).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                this.handlerSelect(pageSize, current, searchParams)
                message.success('修改成功')
            } else {
                message.error(data.msg)
            }
        })
    }

    handlerAdd(params) {
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({}, tabInfos, params)
        const newParams = {
            sorgId: options.sorgId,
            ptype: options.ptype,
            stype: options.ptype,
            schemeId: options.schemeId
        }
        axios.post(`/back/splitScheme/splitScheme`, newParams).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                this.handlerSelect()
                message.success('新增成功')
            } else {
                message.error(data.msg)
            }
        })
    }


    showModal(status) {
        if (status) {
            this.setState({
                visible: true,
                modalTitle: '修改-机构分润配置'
            });
        } else {
            this.setState({
                visible: true,
                modalTitle: '新增-机构分润配置',
                tabInfos: {},
                isUpdate: false
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

    handlerModalOk = (err, values) => {
        const isUpdate = this.state.isUpdate;
        this.refs.form.validateFields((err, values) => {
            if (err) return;
            // 修改机构名称参数 sorgId
            values.sorgId = values.sorgId.pop()
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

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            if (err) return
            this.setState({
                searchParams: values
            })
            this.handlerSelect(this.state.pageSize, 1, values)
        })
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    // 获取分润方案
    selectScheme = (offset) => {
        axios.get(`/back/frscheme/schemes`, {
            params: {
                offset: offset,
                limit: 10000
            }
        }).then((resp) => {
            const scheme = resp.data.rows;
            this._isMounted && this.setState({
                scheme
            })
        })
    }

    render() {
        const { selectedRowKeys, scheme } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.handlerSelect(pageSize, current, searchParams)
        })
        const columns = [
            {
                title: '机构名称',
                dataIndex: 'sName',
            }, {
                title: '机构类型',
                dataIndex: 'typeName',
            }, {
                title: '分润方案名称',
                dataIndex: 'schemeName',
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
                dataIndex: 'isSameOrg',
                fixed: 'right',
                render: (text, record) => {
                    // isSameOrg: true 禁止操作  false 允许操作
                    return <DropOption
                        onMenuClick={e => this.handleMenuClick(record, e)}
                        menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]}
                        dropdownProps={{disabled: text}}
                    />
                }
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="机构分润配置" location={this.props.location} />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <Row>
                        <Col span={12}>
                            <ConfigHeader ref="normalForm" style={{ float: 'left' }} scheme={scheme} />
                        </Col>
                        <Col span={12}>
                            <div style={{ float: 'right' }}>
                                <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{ marginTop: 16 }} bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row gutter={12}>
                        <Col span={24}>
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
                    <Modal
                        width="768px"
                        wrapClassName="vertical-center-modal"
                        title={this.state.modalTitle}
                        onOk={this.handlerModalOk}
                        onCancel={this.handlerHideModal}
                        visible={this.state.visible}
                    >
                        <ConfigModal ref="form"
                            onSubmit={this.handlerModalOk}
                            tabInfos={this.state.tabInfos}
                            scheme={scheme}
                        />
                    </Modal>
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                scroll={{ x: true }}
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
export default ShareConfig
