import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card, Table, Modal, message } from 'antd'
import axios from 'axios'
import ProgramModal from "../../components/ShareBenefit/program/index";
import ProgramHeader from '../../components/ShareBenefit/program/ProgramHeader'
import DetailModal from "../../components/ShareBenefit/detail/index";
import RightTab from '../../components/ShareBenefit/program/RightTab'
import { sloveRespData } from '../../utils/index'
import '../../style/sharebenefit/reset-antd.less'
import DropOption from '../../components/DropOption/DropOption'
import './program.less'

const confirm = Modal.confirm
const defaultPageSize = 10;
class ShareBenefitPage extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        detailData: [],
        pagination: {},
        current: 1,
        passwayId: '',
        total: '',
        visible: false,
        passway: [],
        tabInfos: {},
        detailInfos: {},
        modalTitle: '新增-分润方案',
        modalDTitle: '新增-分润方案明细',
        d_visible: false,
        isUpdate: false,
        pageSize: 10,                           //默认分页大笑
        searchParams: undefined,                //查询参数
        expandedRowKeys: [],                    //展开的行
        columns: [{
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
            dataIndex: 'lastEdittime'
        }, {
            title: '操作',
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <DropOption
                        onMenuClick={e => this.handleMenuClick(record, e)}
                        menuOptions={[
                            { key: '1', name: '修改' },
                            { key: '2', name: '删除' },
                            { key: '3', name: '新增分润明细' }
                        ]}
                    />
                )
            }
        }]
    };

    componentWillMount() {
        this.handlerSelect(this.state.pageSize);
        this._getPassWay()
    }

    handleMenuClick(record, e) {
        const self = this;
        if (e.key === '1') {
            console.log(record)
            let updateStatus = true;
            this.setState({ isUpdate: true, tabInfos: record })
            this.showModal(updateStatus)
        } else if (e.key === '2') {
            const arr = [];
            const id = record.id;
            arr.push(id)
            this.setState({ selectedRowKeys: arr })
            self.handleDelete(record.id)
        } else if (e.key === '3') {
            console.log(record)
            const { schemeName, passwayId, id } = record
            console.log(id)
            this.setState({ d_visible: true, detailInfos: { schemeName, passwayId, id }, isUpdate: false })
        }
    }

    handleDetailMenuClick(record, e) {
        const self = this;
        if (e.key === '1') {
            this.setState({
                isUpdate: true,
                detailInfos: record,
                d_visible: true
            })
        } else if (e.key === '2') {
            const id = record.id;
            self.handleDetailDelete(id)
        } else if (e.key === '3') {
            this.setState({ d_visible: true, detailInfos: {}, isUpdate: false })
        }
    }

    _getPassWay() {
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
    }

    /**
     * 获取分润方案
     * @author donghaijun
     * @param {*} limit 
     * @param {*} offset 
     * @param {*} name 
     * @param {*} passwayid 
     */
    handlerSelect(limit = 10, offset = 1, name, passwayId) {
        this.setState({
            loading: true
        })
        axios.get('/back/frscheme/schemes', {
            params: {
                limit,
                offset,
                name,
                passwayId
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



    handlerAdd(params) {
        const options = Object.assign({}, params);
        axios.post(`/back/frscheme/frscheme`, options).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if (data.rel) {
                message.success('添加成功')
                this.handlerSelect(this.state.pageSize)
            } else {
                message.error(data.msg)
            }
        })
    }

    handlerDetailAdd(params) {
        const { id } = this.state.detailInfos;
        axios.post(`/back/frschemeDetail/frschemeDetail`, {
            schemeId: id,
            tradesumLow: params.tradesumLow,
            industryId: params.industryId[params.industryId.length - 1],
            tradesumHigh: params.tradesumHigh,
            tradetimeLow: params.tradetimeLow,
            tradetimeHigh: params.tradetimeHigh,
            rate: params.rate
        }).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if (data.rel) {
                message.success('添加成功')
                this.getDetailData(10, 1, id)
                this.handlerSelect(this.state.pageSize)
            } else {
                message.error(data.msg, 20)
            }
        });
    }

    handleUpdate(options) {
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({}, tabInfos, options)
        axios.put(`/back/frscheme/${params.id}`, {
            "schemeName": params.schemeName,
            "passwayId": params.passwayId
        }).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('修改成功')
                this.handlerSelect(this.state.pageSize)
            } else {
                message.error(data.msg)
            }
        })
    }

    handleDetailUpdate(options) {
        this.refs.form.resetFields()
        const updateData = this.state.updateData;
        const params = Object.assign({}, updateData, options)
        if (options.hasOwnProperty('industryId')) {
            let params = options.industryId.join(',')
            options['industryId'] = params
        }
        axios.put(`/back/frschemeDetail/${params.id}`, {
            "schemeId": params.schemeId,
            "tradesumLow": params.tradesumLow,
            "industryId": params.industryId,
            "tradesumHigh": params.tradesumHigh,
            "tradetimeLow": params.tradetimeLow,
            "tradetimeHigh": params.tradetimeHigh,
            "rate": params.rate
        }).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('修改成功')
                this.handlerSelect(this.state.pageSize)
            } else {
                message.error(data.msg)
            }
        })
    }
    /**
     * 分润方案删除
     * @param {*} id 
     */
    handleDelete(id) {
        confirm({
            title: '确定要删除吗？',
            onOk: () => {
                axios.delete(`/back/frscheme/remove/${id}`).then(res => res.data).then(res => {
                    if (res.rel) {
                        message.success('删除成功')
                        this.handlerSelect(this.state.pageSize)
                    } else {
                        message.error(res.msg, 20)
                    }
                })
            }
        })
    }
    /**
     * 分润明细删除
     * @param {*} id 
     */
    handleDetailDelete(id) {
        confirm({
            title: '确定要删除吗?',
            onOk: () => {
                axios.delete(`/back/frschemeDetail/remove/${id}`).then(({ data }) => {
                    if (data.rel) {
                        message.destroy()
                        message.success('删除成功')
                        this.getDetailData(10, 1, id)
                    } else {
                        message.error(data.msg)
                    }
                })
            }
        })
    }

    showModal(status) {
        if (status) {
            this.setState({
                visible: true,
                modalTitle: '修改-分润方案'
            });
        } else {
            this.setState({
                visible: true,
                modalTitle: '新增-分润方案',
                isUpdate: false,
                tabInfos: {}
            });
        }
    }

    handlerHideModal = (e) => {
        this.setState({
            visible: false
        })
        this.refs.form.resetFields()
    }

    handlerDetailHideModal = (e) => {
        this.setState({
            d_visible: false
        })
        this.refs.detailForm.resetFields()
    }

    handlerModalOk = (err, values) => {
        const isUpdate = this.state.isUpdate;
        console.log(isUpdate)
        this.refs.form.validateFields((err, values) => {
            if (err) return;
            if (isUpdate) {
                this.handleUpdate(values)
            } else {
                this.handlerAdd(values)
            }
            if (!err) {
                this.refs.form.resetFields()
                this.handlerHideModal()
            }
        });
    }

    handlerDetailModalOk = (err, values) => {
        const isUpdate = this.state.isUpdate;
        console.log(isUpdate)
        this.refs.detailForm.validateFields((err, values) => {
            if (err) return;
            console.log(values)
            if (isUpdate) {
                this.handleDetailUpdate(values)
            } else {
                this.handlerDetailAdd(values)
            }
            if (!err) {
                this.handlerDetailHideModal()
                this.refs.detailForm.resetFields()
            }
        });
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    handlerTableChange = (current, pageSize) => {
        this.handlerSelect(pageSize, current, this.state.searchParams)
    }
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize
        })
        this.handlerSelect(pageSize, current, this.state.searchParams)
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            console.log(values)
            const limit = this.state.pageSize,
                offset = 1,
                name = values.name;
            this.setState({
                searchParams: name
            })
            this.handlerSelect(limit, offset, name)
        })
    }
    /**
     * 点击展开图标时触发
     * @param expanded 是否展开状态
     * @param
     */
    onExpand = (expanded, record) => {
        console.log(expanded, record)
        if (expanded) {
            this.setState({
                expandedRowKeys: [record.key]
            })
            const { id } = record;
            const limit = 10,
                offset = 1;
            this.setState({ loading: true })
            this.getDetailData(limit, offset, id)
        } else {
            this.setState({
                expandedRowKeys: []
            })
        }
    }
    /**
     * 获取分润明细数据
     * @param limit  请求条数 
     * @param offset 请求页
     * @param id     分润方案id
     */
    getDetailData = (limit, offset, id) => {
        axios.get(`/back/frschemeDetail/schemedetails?limit=${limit}&offest=${offset}&schemeId=${id}`)
            .then((resp) => {
                const detailData = resp.data.rows;
                this.setState({
                    detailData: sloveRespData(detailData, 'id'),
                    loading: false,
                })
            })
    }
    expandedRowRender = (record) => {
        const columns = [
            {
                title: '序号',
                dataIndex: 'order_id',
                render: (text, record) => <span>{text}</span>
            }, {
                title: '分润方案名称',
                dataIndex: 'schemeName',
            }, {
                title: '交易金额下限',
                dataIndex: 'tradesumLow',
            }, {
                title: '交易金额上限',
                dataIndex: 'tradesumHigh',
            }, {
                title: '交易笔数下限',
                dataIndex: 'tradetimeLow',
            }, {
                title: '交易笔数上限',
                dataIndex: 'tradetimeHigh',
            }, {
                title: '费率(%)',
                dataIndex: 'rate',
            },
            // {
            //     title: '创建人',
            //     dataIndex: 'creatorId',
            // }, {
            //     title: '创建时间',
            //     dataIndex: 'createTime',
            // }, {
            //     title: '修改人',
            //     dataIndex: 'lastEditorid',
            // }, {
            //     title: '修改时间',
            //     dataIndex: 'lastEdittime'
            // }, 
            {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => {
                    return (
                        <DropOption
                            onMenuClick={e => this.handleDetailMenuClick(record, e)}
                            menuOptions={[
                                { key: '1', name: '修改' },
                                { key: '2', name: '删除' }
                            ]}
                        />
                    )

                }
            }
        ]
        const orderId = record.order_id
        const { detailData } = this.state;
        return (
            <Table
                className="components-table-demo-nested"
                // scroll={{ x: '135%' }}
                columns={columns}
                dataSource={detailData}
                pagination={false}
            />
        )
    }


    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        }
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
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="分润方案" location={this.props.location} />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <Row>
                        <Col span={12}>
                            <ProgramHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                        </Col>
                        <Col span={12}>
                            <div style={{ float: 'right' }}>
                                <Button type="primary" onClick={this.handlerNormalForm} className="btn-search">查询</Button>
                                <Button className="btn-reset" onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Row>
                    <Col span={24}>
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
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    {/* 分润方案明细 */}
                                    <Modal title={this.state.modalDTitle} onOk={this.handlerDetailModalOk} onCancel={this.handlerDetailHideModal} visible={this.state.d_visible} width={855}>
                                        <DetailModal ref="detailForm" onSubmit={this.handlerDetailModalOk} update={this.state.detailInfos} passwayId={this.state.passwayId} />
                                    </Modal>
                                </Col>
                                <Col>
                                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={620}>
                                        <ProgramModal ref="form" onSubmit={this.handlerModalOk} options={this.state.passway} tabInfos={this.state.tabInfos} />
                                    </Modal>
                                </Col>
                            </Row>
                            <Row gutter={12} style={{ marginTop: 12 }}>
                                <Col span={24}>
                                    <Table
                                        expandRowByClick  //通过点击行来展开子行
                                        expandedRowRender={this.expandedRowRender}
                                        onExpand={this.onExpand}
                                        expandedRowKeys={this.state.expandedRowKeys}
                                        columns={this.state.columns}
                                        dataSource={this.state.dataSource}
                                        pagination={pagination}
                                        loading={this.state.loading}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ShareBenefitPage
