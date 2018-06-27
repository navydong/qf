/*
 * @Author: yss.donghaijun 
 * @Date: 2018-04-10 15:25:16 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-06-25 16:49:36
 */

import React from 'react'
import axios from 'axios'
import { Card, Table, Modal, Button, notification, Badge, Tooltip } from 'antd'
import SearchBox from './searchBox'
import RefundDetail from './refundDetail'
import { paginat } from '@/utils/pagination'
import fmoney from '@/utils/fmoney'

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
        visible: false,
        confirmLoading: false,
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
    // 表格退款按钮
    refund = (record) => {
        this.setState({
            currentData: record,
            visible: true,
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
    // 确认退款
    refundOk = () => {
        this.refundDetail.validateFields((err, values) => {
            if (err) return
            const sum = values.sum
            const { merchantId, orders, passwayId } = this.state.currentData
            let url = ''
            if (passwayId === '微信') {
                url = '/back/wxwallet/wxpcrefund'
            }
            if (passwayId === '支付宝') {
                url = '/back/aliWallet/pctraderefund'
            }
            this.setState({
                confirmLoading: true
            })
            axios.post(url, {
                merchantId,
                sum,
                orders
            }).then(({ data }) => {
                if (data.flag) {
                    this.getPageList(this.state.pageSize, 1, this.state.searchParams)
                    notification.success({
                        message: '退款成功',
                        description: `退款￥${sum}元`
                    })
                } else {
                    notification.error({
                        message: '退款失败',
                        description: data.orderStatus
                    })
                }
                this.setState({
                    confirmLoading: false,
                    visible: false
                })
            }).catch(err => {
                notification.error({
                    message: '退款失败',
                    description: err.message
                })
            })

            this.refundDetail.resetFields()
        })

    }

    modalCancel = () => {
        this.setState({
            visible: false
        })
        this.refundDetail.resetFields()
    }

    render() {
        const { loading, data, currentData, visible, confirmLoading } = this.state
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        const columns = [
            {
                title: '交易时间',
                dataIndex: "tradedt",
            }, {
                title: "商户名称",
                dataIndex: "merchantName",
            }, {
                title: "通道",
                dataIndex: "passwayId",
            },
            {
                title: '可退金额',
                dataIndex: 'remainSum',
                className: 'table_text_right',
                render: (text) => {
                    return fmoney(text)
                }
            },
            {
                title: "交易金额",
                dataIndex: "sum",
                className: 'table_text_right',
                render: (text) => {
                    return fmoney(text)
                }
            },
            {
                title: "订单号",
                dataIndex: "orders",
            },
            // {
            //     title: "交易类型",
            //     dadaIndex: "typeName",
            //     className: 'table_text_center',
            // }, 
            {
                title: "支付方式",
                dataIndex: "paySceneName",
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
            }, {
                title: "费率",
                dataIndex: "rate",
                // className: 'table_text_center',
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
            }, {
                title: "备注",
                dataIndex: "remark",
            }, {
                title: '操作',
                fixed: 'right',
                render: (text, record, index) => (
                    <Button type="primary" onClick={(e) => this.refund(record)} >退款</Button>
                )
            }
        ]
        return (
            <div>
                <Card
                    bordered={false}
                    bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                    noHovering
                >
                    <SearchBox loading={this.state.loading} search={this.search} />
                </Card>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }} >
                    <Table
                        scroll={{ x: true }}
                        loading={loading}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                        rowKey="orders"
                    />
                </Card>
                {/* 退款详情页面 */}
                <Modal
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onCancel={this.modalCancel}
                    onOk={this.refundOk}
                    bodyStyle={{ padding: '30px 40px' }}
                >
                    <RefundDetail ref={e => this.refundDetail = e} record={currentData} />
                </Modal>
            </div>
        )
    }
}

export default Refund