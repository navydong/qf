import React from 'react'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import { Row, Col, Button, Card, Table } from 'antd'
import axios from 'axios'
import AllBillHeader from '@/components/Bill/AllBill/AllBillHeader'
import { sloveRespData } from '@/utils/index'
import { paginat } from '@/utils/pagination'


const columns = [
    {
        title: '序号',
        dataIndex: 'order_id'
    }, {
        title: '商户名称',
        dataIndex: 'merchantname'
    }, {
        title: '商户号',
        dataIndex: 'mercode'
    }, {
        title: '订单号',
        dataIndex: 'orders'
    }, {
        title: '交易类型',
        dataIndex: 'type',
    }, {
        title: ' 费率 ',
        dataIndex: 'fee',
    }, {
        title: '支付方式',
        dataIndex: 'passwayname'
    }, {
        title: '总金额',
        dataIndex: 'sum'
    }, {
        title: '商品名称',
        dataIndex: 'goodsname'
    }, {
        title: '账单商户号',
        dataIndex: 'billmchcode'
    }, {
        title: '账单订单号',
        dataIndex: 'billorders'
    }, {
        title: '账单支付方式',
        dataIndex: 'billpasswayname'
    }, {
        title: '账单交易类型',
        dataIndex: 'billtype'
    }, {
        title: '账单总金额',
        dataIndex: 'billsum'
    }, {
        title: '账单费率',
        dataIndex: 'billfee',
    }, {
        title: '账单交易开始时间',
        dataIndex: 'billtradecfdt'
    }, {
        title: '账单交易结束时间',
        dataIndex: 'billtradedt'
    }
]
class BillDetail extends React.Component {
    state = {
        loading: false,
        dataSource: [],
        visible: false,
        current: 1,
        total: '',
        passway: [],
        startTime: '',
        endTime: '',
        pageSize: 10,                     //分页大小
        searchParams: {},                 //查询参数
    };

    componentWillMount() {
        this.handlerSelect();
        this._getPassWay();
    }
    /**
     * 获取列表项
     * 
     * @param {*} limit 
     * @param {*} offset 
     * @param {*} startTime 
     * @param {*} endTime 
     * @param {*} tradetype 
     */
    handlerSelect(limit = 10, offset = 1, params) {
        this.setState({
            loading: true
        })
        axios.get('/back/tradeBlotter/getCompareBill', {
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


    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err, fieldsValue) => {
        this.refs.normalForm.validateFields((err, fieldsValue) => {
            if (err) return;
            if (fieldsValue.startTime) {
                fieldsValue.startTime = fieldsValue.startTime.format('YYYY-MM-DD')
            }
            if (fieldsValue.endTime) {
                fieldsValue.endTime = fieldsValue.endTime.format('YYYY-MM-DD')
            }
            this.setState({
                searchParams: fieldsValue
            })
            this.handlerSelect(this.state.pageSize, 1, fieldsValue)
        })
    }

    handlerTableChange = (current, pageSize) => {
        console.log(current, pageSize)
        this.handlerSelect(pageSize, current, ...this.state.searchParams)
    }

    onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize)
        this.setState({
            pageSize
        })
        this.handlerSelect(pageSize, current, ...this.state.searchParams)
    }

    render() {
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.handlerSelect(pageSize, current, searchParams)
        })
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="对账管理" second="对账信息" location={this.props.location} />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <Row>
                        <Col span={24}>
                            <AllBillHeader ref="normalForm" onSubmit={this.handlerNormalForm} passway={this.state.passway} />
                        </Col>
                        <Col span={24}>
                            <div style={{ float: 'right' }}>
                                <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <Table
                                scroll={{ x: '200%' }}
                                bordered={false}
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
export default BillDetail
