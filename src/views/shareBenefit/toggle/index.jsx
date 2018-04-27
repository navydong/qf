/*
 * @Author: yss.donghaijun 
 * @Date: 2018-04-27 10:28:22 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-04-27 14:24:07
 */

import React from 'react'
import axios from 'axios'
import { Row, Col, Button, Card, Table, message } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import SearchBox from './SearchBox'
import '@/style/sharebenefit/reset-antd.less'
import { paginat } from '@/utils/pagination'


function sloveRespData(dataSource) {
    if (Array.isArray(dataSource)) {
        dataSource.forEach((item, index) => {
            item['key'] = Math.random() + index
            if (item.children && item.children.length > 0) {
                sloveRespData(item.children)
            } else {
                delete item.children
            }
        })
    }
}
const columns = [
    { title: '日结日期', dataIndex: 'settlementTime', width: 200 },
    { title: '交易总金额', dataIndex: 'totalmoney' },
    { title: '通道类型', dataIndex: 'passwayId' },
    { title: '交易总笔数', dataIndex: 'totaltimes' },
    { title: '机构', dataIndex: 'orgrelationId' },
    { title: '分润金额', dataIndex: 'profitmoney' }
]

class ShareToggle extends React.Component {
    state = {
        total: 0,             //数据总数
        current: 1,
        pageSize: 10,         //分页大小
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        searchParams: {}      //搜索参数
    };

    componentDidMount() {
        this.initSelect()
    }

    initSelect(limit = 10, offset = 1, params) {
        this.setState({ loading: true })
        axios.get(`/back/profit/page`, {
            params: {
                limit,
                offset,
                ...params
            }
        }).then((resp) => {
            const { rows: dataSource, total } = resp.data
            sloveRespData(dataSource)
            this.setState({
                dataSource: dataSource,
                loading: false,
                current: offset,
                total
            })
        })
    }


    handleReset = () => {
        this.refs.normalForm.resetFields();
        // this.refs.normalForm.resetDate()
        console.log(this.refs.normalForm)
    }
    // 查询
    handlerNormalForm = (fieldsValue) => {
        this.setState({
            searchParams: fieldsValue
        })
        this.initSelect(this.state.pageSize, 1, fieldsValue)

    }
    // 计算
    handlerCaculate = (fieldsValue) => {
        this.setState({
            searchParams: fieldsValue
        })
        axios.post(`/back/profit/calculate`, fieldsValue).then(({data}) => {
            if (data.rel) {
                message.success(data.msg)
                this.initSelect(this.state.pageSize, 1, fieldsValue)
            } else {
                message.error(data.msg)
            }
        })
    }


    render() {
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.initSelect(pageSize, current, searchParams)
        })
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="分润统计" location={this.props.location} />

                <Card
                    bordered={false}
                    bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                    noHovering
                >
                    <SearchBox loading={this.state.loading} handlerNormalForm={this.handlerNormalForm} handlerCaculate={this.handlerCaculate} />
                </Card>
                <Card
                    bordered={false}
                    noHovering
                    bodyStyle={{ paddingLeft: 0 }}>
                    <Table
                        className="components-table-demo-nested"
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={pagination}
                        loading={this.state.loading}
                    />
                </Card>
            </div>
        )
    }
}
export default ShareToggle
