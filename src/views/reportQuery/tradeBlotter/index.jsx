import React, { Component } from 'react'
import { Row, Col, Card, Button, Table, Modal, message } from 'antd'
import axios from 'axios'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import AddModal from './AddModal'
import DropOption from './DropOption'
import SearchBox from './SearchBox'
import './index.less'
const ButtonGroup = Button.Group

//每页请求条数 
const defaultPageSize = 10;

class TradeBlotter extends Component {
    state = {
        loading: true, //表格是否加载中
        data: [],
        total: '',
        current: 1,
        visible: false,
        selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
        selectedRows: [], //选中行的具体信息
        item: {}
    }
    componentDidMount() {
        this.getPageList()
    }
    /**
     * 
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {String} name 通道名称
     */
    getPageList(limit = 10, offset = 1, name = "''") {
        this.state.loading ? '' : this.setState({ loading: true })
        axios.post('/back/tradeBlotter/page', {
            params: {
                limit,
                offset,
                name
            }
        }).then(({data}) => {
            data.rows.forEach((item, index) => {
                item.index = `${index + 1}`
                item.key = `${item.passwayName}${index}`
            })
            this.setState({
                total: data.total,
                data: data.rows,
                current: offset,
                loading: false,
            })
        })
    }
    //增加按钮
    addHandle = () => {
        this.setState({
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
            title: this.state.selectedRowKeys.length > 1 ? '确认批量删除' : '确认删除',
            content: `当前被选中的行: ${this.state.selectedRowKeys.join(', ')}`,
            // 这里注意要用箭头函数, 否则this不生效
            onOk: () => {
                axios.all(this.state.selectedRows.map((item) => {
                    return axios.delete(`/back/passway/remove/${item.id}`)
                })).then(axios.spread((acct, perms) => {
                    console.log(acct, perms)
                    if (!acct.data.rel) {
                        message.error('删除失败')
                        return
                    }
                    message.success('删除成功')
                    this.handleDelete();
                }))
            },
        });
    }
    /**
     * 发送http请求，删除数据，更新表格
     * @param keys:Array  选中行的key
     */
    handleDelete(keys = this.state.selectedRowKeys) {
        let data = this.state.data.slice()
        for (let i = 0, len = data.length; i < len; i++) {
            for (let j = 0; j < keys.length; j++) {
                if (data[i] && data[i].key === keys[j]) {
                    data.splice(i, 1);
                    i--;
                }
            }
        }
        this.setState({
            data: data,
            selectedRowKeys: []
        })
    }
    /**
     * 模态框提交按钮
     * @param values
     */
    handleOk = (values) => {
        console.log('Received values of form: ', values);
        axios.post('/back/passway/passway', values)
            .then(({ data }) => {
                message.success('添加成功！')
                if (data.rel) {
                    let newData = this.state.data.slice()
                    newData.push({
                        key: values.passwayName,
                        passwayName: values.passwayName,
                    })
                    this.setState({
                        data: newData
                    })
                }
            })
        this.setState({
            visible: false,
        });
        // 清空表单
        this.refs.addModal.resetFields()
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
     * 下拉按钮组件
     */
    handleMenuClick = (record, e) => {
        if (e.key === '1') {
            //详细按钮
            this.setState({
                item: record,
                visible: true,
            })
        } else if (e.key === '2') {
            //更新按钮
            this.setState({
                item: record,
                visible: true,
            })
            //this.handleOk(record)
        }
    }
    /**
     * 页码改变的回调，参数是改变后的页码及每页条数
     * @param page 改变后的页码
     * @param pageSize 改变页的条数
     */
    pageChange = (page, pageSize) => {
        this.getPageList(10, page)
    }
    /**
     * pageSize 变化的回调
     * @param current 当前页码
     * @param pageSize 改变后每页条数
     */
    onShowSizeChange = (current, pageSize) => {
        this.getPageList(pageSize, current)
    }
    /**
     * 查询功能
     * @param values 
     */
    search = (values) => {
        console.log(values.industryName)
        this.getPageList(10, 1, values.industryName)
    }
    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        const pagination = {
            defaultPageSize,
            current: this.state.current,
            total: this.state.total,
            onChange: this.pageChange,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            showTotal: (total, range) => `共${total}条数据`,
            showQuickJumper: true
        }
        //表格表头信息
        const columns = [
            {
                title: "序号",
                dataIndex: "index",
            }, {
                title: "交易日期",
                dataIndex: "tradedt",
            }, {
                title: "商户ID",
                dataIndex: "merchant_id",
            }, {
                title: "通道ID",
                dataIndex: "passway_id",
            }, {
                title: "订单号",
                dataIndex: "orders",
            }, {
                title: "交易类型",
                dadaIndex: "type",
            }, {
                title: "交易金额",
                dataIndex: "sum",
            }, {
                title: "手续费",
                dataIndex: "fee",
            }, {
                title: "交易状态",
                dataIndex: "state",
            }, {
                title: "服务商",
                dataIndex: "ffacname",
            }, {
                title: "受理机构",
                dataIndex: "s0",
            }, {
                title: "设备品类",
                dataIndex: "s1",
            }, {
                title: "钱包方订单号",
                dataIndex: "s2",
            }, {
                title: "支付状态",
                dataIndex: "s3",
            }, {
                title: "费率",
                dataIndex: "s4",
            }, {
                title: "退款金额",
                dataIndex: "s5",
            }, {
                title: "退款订单号",
                dataIndex: "s6",
            }, {
                title: "交易确认时间",
                dataIndex: "s7",
            }, {
                title: "工具",
                render: (text, record) => (
                    <DropOption
                        onMenuClick={(e) => this.handleMenuClick(record, e)}
                        menuOptions={[{ key: '1', name: '详细' }, { key: '2', name: '更新' }]}
                    />
                )
            }
        ]
        return (
            <div className="templateClass">
                <BreadcrumbCustom first="报表查询" second="订单查询-明细" />
                <Card>
                    <SearchBox loading={this.state.loading} search={this.search} />
                </Card>
                <Card style={{ marginTop: 10 }}>
                    <Row gutter={40} style={{ marginBottom: 20 }}>
                        <Col span={24}>
                            <ButtonGroup>
                                <Button
                                    type="primary"
                                    icon="plus-circle-o"
                                    onClick={this.addHandle}
                                >增加
                                </Button>
                                <Button
                                    type="primary"
                                    icon="close-circle-o"
                                    disabled={!hasSelected}
                                    onClick={this.onClickDelete}
                                >
                                    {multiSelected ? '批量删除' : '删除'}
                                </Button>
                                <AddModal ref="addModal" onOk={this.handleOk}
                                    modalProps={{
                                        title: "新增-通道信息",
                                        okText: "提交",
                                        width: "50%",
                                        item: this.state.item,
                                        wrapClassName: "vertical-center-modal",
                                        visible: this.state.visible,
                                        onCancel: this.handleCancel
                                    }}
                                />
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table
                                bordered
                                loading={this.state.loading}
                                columns={columns}
                                dataSource={this.state.data}
                                rowSelection={rowSelection}
                                pagination={pagination}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default TradeBlotter