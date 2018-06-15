import React from 'react';
import { Card, Col, Row, Table } from 'antd';
import axios from 'axios';
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import { paginat } from '@/utils/pagination';
import SearchBox from './searchBox';

const sloveRespData = (dataSource) => {
    if (!dataSource) return;
    dataSource.forEach((item, index) => {
        item.key = `${index}`
    })
    return dataSource;
}


const columns = [
    {
        title: '月份',
        dataIndex: 'tradedt'
    }, {
        title: '所属机构',
        dataIndex: 'facname'
    }, {
        title: '商户号',
        dataIndex: 'wxMerchantId'
    }, {
        title: '商户名',
        dataIndex: 'wxMerchantName'
    }, {
        title: '微信有效交易额(单位:元)',
        dataIndex: 'wxTradeAmount',
        width: 120
    }, {
        title: '手赞有效交易额(单位:元)',
        dataIndex: 'szTradeAmount',
        width: 120
    }, {
        title: '交易差额(单位:元)',
        dataIndex: 'shortfallAmount',
        width: 100
    }
]

class BillDetail extends React.Component {
    _isMounted = false
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
    componentDidMount() {
        this._isMounted = true
        this.handlerSelect();
        this._getPassWay();
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    /**
     * 获取表格数据
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
        axios.get('/back/detailController/page', {
            params: {
                limit,
                offset,
                ...params
            }
        }).then((resp) => {
            const dataSource = resp.data.rows,
                total = resp.data.total;
            this._isMounted && this.setState({
                dataSource: sloveRespData(dataSource),
                loading: false,
                current: offset,
                total
            })
        })
    }
    _getPassWay() {
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this._isMounted && this.setState({
                passway
            })
        })
    }
    // 搜索
    search = (values) => {
        this.setState({
            searchParams: values
        })
        this.handlerSelect(this.state.pageSize, 1, values)
    }

    handlerTableChange = (current, pageSize) => {
        this.handlerSelect(pageSize, current, ...this.state.searchParams)
    }

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize
        })
        this.handlerSelect(pageSize, current, ...this.state.searchParams)
    }

    render() {
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.handlerSelect(pageSize, current, searchParams)
        })
        const rowClassName = (record, index) => {
            if (parseInt(record.shortfallAmount) > 0) {
                return 'has_difference'
            }
        }
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom location={this.props.location} />

                <Card
                    bordered={false}
                    bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                    noHovering
                >
                    <SearchBox loading={this.state.loading} search={this.search} />
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <Table
                                bordered={false}
                                columns={columns}
                                dataSource={this.state.dataSource}
                                pagination={pagination}
                                loading={this.state.loading}
                                rowClassName={rowClassName}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default BillDetail
