import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Table, message, Alert } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom'
import SearchBox from './SearchBox'
import { paginat } from '@/utils/pagination'
import moment from 'moment'

class TradeBlotter extends Component {
    state = {
        loading: true, //表格是否加载中
        data: [],
        total: 0,                          //总数
        current: 1,                        //当前页数
        pageSize: 10,                      //每页数量
        visible: false,
        item: {},
        searchParams: {},                  //查询参数
        selectedRows: [],                  //表格选择行
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
            if (typeof res.data === 'string') {
                return
            }
            let data = res.data
            this.setState({
                total: data.total,
                data: data.rows,
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
            searchParams: values
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
            loading: true
        })
        axios.post('/back/tradeBalcons/calTradebalcons', values).then((res) => {
            if (res.data.rel) {
                message.success(res.data.msg)
                this.setState({
                    loading: false
                })
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
        const { selectedRows } = this.state
        const rowSelection = {
            onChange: this.onTableSelectChange,
        };
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        //表格表头信息
        const columns = [
            {
                title: "交易日期",
                dataIndex: "tradedt",
                width: 100,
                render: (text, record, index) => {
                    return moment(text).format('YYYY-MM-DD')
                }
            }, {
                title: "商户",
                dataIndex: "merchantId",
            }, {
                title: "支付方式",
                dataIndex: "passwayId",
            }, {
                title: "支付笔数",
                dataIndex: "tradetimes",
            }, {
                title: "支付总金额",
                dataIndex: "sum",
            }, {
                title: "退款总金额",
                dataIndex: "refund",
            }, {
                title: "退款总笔数",
                dataIndex: "refundtimes",
            }, {
                title: '合计',
                dataIndex: 'amount'
            }
            // {
            //     title: "手续费",
            //     dataIndex: "fee",
            // }
            /* , {
                title: "操作",
                render: (text, record) => (
                    <DropOption
                        onMenuClick={(e) => this.handleMenuClick(record, e)}
                        menuOptions={[{ key: '1', name: '详细' }, { key: '2', name: '更新' }]}
                    />
                )
            } */
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
                                columns={columns}
                                dataSource={this.state.data}
                                rowKey="id"
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


function calculate(rows, dataIndex) {
    let sum = 0;
    rows.forEach((item, index) => {
        sum += item[dataIndex]
    })
    return sum.toFixed(2)
}