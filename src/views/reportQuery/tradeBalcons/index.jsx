import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Table, message, Alert } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom'
import SearchBox from './SearchBox'
import { paginat } from '@/utils/pagination'
// import { setKey } from '@/utils/setkey'
import moment from 'moment'
import fmoney from '@/utils/fmoney'

const setKey = function (data) {
    for (var i = 0; i < data.length; i++) {
        data[i].key = Math.random()
        if (!data[i].children) {
            console.warn('data.chilren is not exits')
            continue
        }
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
    return data
}

const commonColumns = [
    {
        title: "商户",
        dataIndex: "merchantName",
    },
    {
        title: "支付方式",
        width: 80,
        className: 'table_text_center',
        dataIndex: "passwayId",
    }, {
        title: "支付笔数",
        className: 'table_text_center',
        width: 80,
        dataIndex: "tradetimes",
    }, {
        title: "支付总金额",
        className: 'table_text_right',
        dataIndex: "sum",
        render: (text) => {
            return fmoney(text)
        }
    }, {
        title: "退款笔数",
        width: 80,
        className: 'table_text_center',
        dataIndex: "refundtimes",
    }, {
        title: "退款总金额",
        className: 'table_text_right',
        dataIndex: "refund",
        render: (text) => {
            return fmoney(text)
        }
    }, {
        title: '合计',
        className: 'table_text_right',
        dataIndex: 'amount',
        render: (text) => {
            return fmoney(text)
        }
    }
]

class TradeBlotter extends Component {
    _isMounted = false
    state = {
        loading: true, //表格是否加载中
        data: [],
        total: 0,                                           //总数
        current: 1,                                         //当前页数
        pageSize: 10,                                       //每页数量
        visible: false,
        item: {},
        searchParams: { mode: 'day', isStore: false },      //查询参数
        selectedRows: [],                                   //表格选择行
    }
    componentDidMount() {
        this._isMounted = true
        this.getPageList(10, 1, this.state.searchParams)
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    /**
     * 
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {String} name 通道名称
     */
    getPageList(limit = 10, offset = 1, param) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/tradeBalcons/page', {
            params: {
                limit,
                offset,
                ...param
            }
        }).then((res) => {
            let data = res.data
            this._isMounted && this.setState({
                total: data.total,
                data: setKey(data.rows),
                current: offset,
                loading: false,
            })
        })
    }
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
            searchParams: values,
        })
        this.getPageList(this.state.pageSize, 1, { ...values })
    }
    /**
     * 订单汇总
     * @param startDate 开始时间
     * @param endDate 结束时间
     */
    summary = (values) => {
        this.setState({
            searchParams: values,
        })
        axios.post('/back/tradeBalcons/calTradebalcons', values).then((res) => {
            if (res.data.rel) {
                // message.success(res.data.msg)
                // 汇总成功直接查询
                this.getPageList(this.state.pageSize, 1, { ...values })
            } else {
                message.error(res.data.msg)
            }
        })
    }

    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
        })
    }
    render() {
        const { selectedRows, searchParams } = this.state
        const rowSelection = {
            onChange: this.onTableSelectChange,
        };
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        // 表格表头信息
        // 按天汇总
        const columns_day = [
            {
                title: "交易日期",
                dataIndex: "tradedt",
                // width: 100,
                render: (text, record, index) => {
                    if (!text) return null
                    return moment(text).format('YYYY-MM-DD')
                }
            },
            ...commonColumns
        ]
        // 按月汇总
        const columns_month = [
            {
                title: "交易月份",
                dataIndex: "tradedt",
                width: 80,
                render: (text, record, index) => {
                    if (!text) return null
                    return moment(text).format('YYYY-MM')
                }
            },
            ...commonColumns,
            {
                title: '日均',
                dataIndex: 'aveDay',
                className: 'table_text_right',
                render: (text) => {
                    return fmoney(text)
                }
            }
        ]
        return (
            <div className="templateClass">
                <BreadcrumbCustom first="报表查询" second="订单查询-汇总" location={this.props.location} />
                <Card
                    bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering
                >
                    <SearchBox loading={this.state.loading} search={this.search} summary={this.summary} />
                </Card>
                <Card
                    bordered={false}
                    noHovering
                    bodyStyle={{ paddingLeft: 0 }}
                >
                    <Row>
                        <Col>
                            <Table
                                // scroll={{x:1277}}
                                noHovering bodyStyle={{ paddingLeft: 0 }}
                                loading={this.state.loading}
                                columns={searchParams.mode == 'day' ? columns_day : columns_month}
                                dataSource={this.state.data}
                                // rowKey="id"
                                // rowSelection={rowSelection}
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