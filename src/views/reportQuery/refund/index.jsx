/*
 * @Author: yss.donghaijun 
 * @Date: 2018-04-10 15:25:16 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-04-26 10:52:19
 */

import React from 'react'
import axios from 'axios'
import { Card, Table, Modal, Button, notification, Badge, Tooltip } from 'antd'

import BreadcrumbCustom from '@/components/BreadcrumbCustom'
import SearchBox from './searchBox'
import { paginat } from '@/utils/pagination'

// 款款详情content
function RefundDetailContent(props) {
    const { merchantName, sum, tradedt, orders } = props
    return (
        <ul>
            <li>商户名称：<span>{merchantName}</span></li>
            <li>订&nbsp; 单&nbsp; 号：<span>{orders}</span></li>
            <li>交易时间：<span>{tradedt}</span></li>
            <li>退款金额：<span style={{ color: 'red' }} >￥{sum}</span></li>
        </ul>
    )
}



class Refund extends React.Component {
    _isMounted = false
    state = {
        loading: true,
        data: [],
        pageSize: 10,
        current: 1,
        searchParams: {}          //查询参数

    }
    componentDidMount() {
        this._isMounted = true
        this.getPageList()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getPageList(limit = this.state.pageSize, offset = this.state.current, params) {
        this.setState({
            loading: true
        })
        axios.get('/back/tradeBlotter/refundpage', {
            params: {
                limit,
                offset,
                ...params
            }
        }).then(({ data }) => {
            this._isMounted && this.setState({
                total: data.total,
                data: data.rows,
                current: offset,
                loading: false,
            })
        })
    }
    refund = (record) => {
        const { merchantId, sum, orders } = record
        Modal.confirm({
            title: '确认要退款？',
            content: <RefundDetailContent {...record} />,
            onOk: () => {
                return axios.post('/back/wxwallet/wxpcrefund', {
                    merchantId,
                    sum,
                    orders
                }).then(({ data }) => {
                    if (data.flag) {
                        this.getPageList(this.state.pageSize, 1, this.state.searchParams)
                        notification.success({
                            message: '退款成功',
                            description: `退款￥${record.sum}元`
                        })
                    } else {
                        notification.error({
                            message: '退款失败',
                            description: data.orderStatus
                        })
                    }
                })
            },
            onCancel() {
                // 取消按钮
            },
        })
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
        const { loading, data } = this.state
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        const columns = [
            {
                // title: "交易发起时间",
                title: '交易时间',
                dataIndex: "tradedt",
                width: 160,
            }, {
                title: "商户名称",
                dataIndex: "merchantName",
                width: 200,
                // className: 'table_text_center',
                render: (text, record, index) => {
                    return <div title={text} style={{ width: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >
                        {text}
                    </div>
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
                    <Badge status="success" text={text} />
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
            },
            //  {
            //     title: "交易确认时间",
            //     dataIndex: "tradecfdt",
            //     width: 160,
            // },
            // {
            //     title: "设备终端",
            //     dataIndex: "terminalName",
            //     width: 100
            // }, 
            {
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
                        <div style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >
                            {text}
                        </div>
                    </Tooltip>
                }
            }, {
                title: '操作',
                width: 50,
                fixed: 'right',
                render: (text, record, index) => (
                    <Button type="primary" onClick={(e) => this.refund(record)} >退款</Button>
                )
            }
        ]
        return (
            <div>
                <BreadcrumbCustom location={this.props.location} />
                <Card
                    bordered={false}
                    bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                    noHovering
                >
                    <SearchBox loading={this.state.loading} search={this.search} />
                </Card>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }} >
                    <Table
                        scroll={{ x: 1550 }}
                        loading={loading}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                        rowKey="orders"
                    />
                </Card>
            </div>
        )
    }
}

export default Refund