import React, { Component } from 'react'
import { Row, Col, Card, Button, Table, Modal, message, Badge, Tooltip } from 'antd'
import axios from 'axios'

import BreadcrumbCustom from '@/components/BreadcrumbCustom'
import SearchBox from './SearchBox'
import { paginat } from '@/utils/pagination'


//交易状态
const statusMap = {
    '支付失败': 'error',
    '待支付': 'warning',
    '支付成功': 'success',
    '退款成功': 'success',
    '退款失败': 'error',
    '退款中': 'processing',
    '部分退款': 'default'
};
class TradeBlotter extends Component {
    _isMounted = false
    state = {
        loading: true,                     //表格是否加载中
        data: [],
        total: 0,                          //总数
        current: 1,                        //当前页数
        pageSize: 10,                      //每页数量
        visible: false,
        selectedRowKeys: [],               //当前有哪些行被选中, 这里只保存key
        selectedRows: [],                  //选中行的具体信息
        item: {},
        searchParams: {},                  //查询参数
    }
    componentDidMount() {
        this._isMounted = true
        // this.title = document.title
        // document.title = '订单查询-明细'
        const id = this.props.params.id
        if (id) {
            this.getPageList(10, 1, { merchantId: id })
        } else {
            this.getPageList()
        }
    }
    componentWillUnmount() {
        this._isMounted = false
        // document.title = this.title
    }
    /**
     *
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {Object} params 其他参数
     */
    getPageList(limit = this.state.pageSize, offset = this.state.current, params) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/tradeBlotter/page', {
            params: {
                limit,
                offset,
                ...params
            }
        }
        ).then(({ data }) => {
            data.rows.forEach((item, index) => {
                item.key = `${index}`
            })
            this._isMounted && this.setState({
                total: data.total,
                data: data.rows,
                current: offset,
                loading: false,
            })
        }).catch(err => console.log(err))
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
        this.setState({
            pageSize: pageSize,
            current: page
        })
        this.getPageList(pageSize, page, this.state.searchParams)
    }
    /**
     * pageSize 变化的回调
     * @param current 当前页码
     * @param pageSize 改变后每页条数
     */
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize,
            current: current
        })
        this.getPageList(pageSize, current, this.state.searchParams)
    }
    /**
     * 查询功能
     * @param values
     */
    search = (values) => {
        this.setState({
            searchParams: values
        })
        this.getPageList(this.state.pageSize, 1, values)
    }
    render() {
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        return (
            <div className="templateClass">
                <BreadcrumbCustom first="报表查询" second="订单查询-明细" location={this.props.location} />
                <Card
                    bordered={false}
                    bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                    noHovering
                >
                    <SearchBox loading={this.state.loading} search={this.search} />
                </Card>
                <Card
                    bordered={false}
                    noHovering bodyStyle={{ paddingLeft: 0 }}
                >
                    <Row>
                        <Col>
                            <Table
                                scroll={{ x: 2020 }}
                                loading={this.state.loading}
                                columns={columns}
                                dataSource={this.state.data}
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


//表格表头信息
const columns = [
    {
        title: "交易发起时间",
        dataIndex: "tradedt",
        width: 160,
    }, {
        title: "商户名称",
        dataIndex: "merchantName",
        // className: 'table_text_center',
        // width: 180,
        render: (text, record, index) => {
            return <Tooltip title={text} >
                <div style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'default' }} >
                    {text}
                </div>
            </Tooltip>
        }
    }, {
        title: "通道",
        dataIndex: "passwayId",
        // className: 'table_text_center',
        width: 60,
    },
    {
        title: "支付方式",
        dataIndex: "paySceneName",
        width: 80
    },
    {
        title: "订单号",
        dataIndex: "orders",
        width: 220,
    },
    // {
    //     title: "交易类型",
    //     dadaIndex: "typeName",
    //     className: 'table_text_center',
    // }, 
    {
        title: "交易金额",
        dataIndex: "sum",
        className: 'table_text_center',
        width: 80
    },
    //  {
    //     title: "手续费",
    //     dataIndex: "fee",
    //     className: 'table_text_center',
    // },
    {
        title: "交易状态",
        dataIndex: "stateName",
        // className: 'table_text_center',
        width: 85,
        render: (text, record) => (
            // console.log(text, record)  status={statusMap[text]}
            <Badge status={statusMap[text]} text={text} />
        )
    },
    // {
    //     title: "设备品类",
    //     dataIndex: "deviceName",
    //     className: 'table_text_center',
    // }, 
    {
        title: "钱包方订单号",
        dataIndex: "tradeNo",
        width: 260,
    }, {
        title: "费率",
        dataIndex: "rate",
        // className: 'table_text_center',
        width: 70
    }, {
        title: "退款金额",
        dataIndex: "refundsum",
        className: 'table_text_center',
        width: 80
    }, {
        title: "退款订单号",
        dataIndex: "refundorders",
        // className: 'table_text_center',
        width: 260
    }, {
        title: "交易确认时间",
        dataIndex: "tradecfdt",
        width: 160,
    },
    {
        title: "设备终端",
        dataIndex: "terminalName",
        width: 100,
        render: (text, record, index) => {
            return <Tooltip title={text} >
                <div style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'default' }} >
                    {text}
                </div>
            </Tooltip>
        }
    }, {
        title: "二维码值",
        dataIndex: "qrNo",
        // className: 'table_text_center',
        width: 100
    }, {
        title: "备注",
        dataIndex: "remark",
        width: 100,
        render: (text, record, index) => {
            return <Tooltip title={text} >
                <div style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'default' }} >
                    {text}
                </div>
            </Tooltip>
        }
    }
]
