import React from 'react';
import { Card, Breadcrumb, Table, Button } from 'antd'
import axios from 'axios'

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            tableLoading: false
        }
    }
    componentDidMount() {
        this.getPageList()
    }
    // 获取订单数据
    async getPageList() {
        this.setState({ tableLoading: true })
        const { data } = await axios.get('/list')
        this.setState({
            tableLoading: false,
            data: data
        })
    }
    // 刷新
    refresh = () => {
        this.getPageList()
    }
    expandedRowRender = (record) => {
        const list = record.list
        const columns = [{
            dataIndex: 'name'
        }, {
            dataIndex: 'num',
            render(text){
                return `x${text}`
            }
        }, {
            dataIndex: 'total',
            render(text){
                return `￥${text}`
            }
        }]
        return <Table
            rowKey="id"
            bordered={false}
            pagination={false}
            showHeader={false}
            columns={columns}
            dataSource={list}
        />
    }
    render() {
        const columns = [{
            title: '时间',
            dataIndex: 'time'
        }, {
            title: '桌号',
            dataIndex: 'table'
        }, {
            title: '总价',
            dataIndex: 'totalPrice'
        }, {
            title: '总数',
            dataIndex: 'count',
        }]
        return (<div>
            <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>点餐</Breadcrumb.Item>
                <Breadcrumb.Item><span style={{ color: '#f93030' }} >订单管理</span></Breadcrumb.Item>
            </Breadcrumb>
            <Button type="primary" onClick={this.refresh} >
                刷新
            </Button>
            <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                <Table
                    rowKey="id"
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={this.state.data}
                    expandedRowRender={this.expandedRowRender}
                />
            </Card>
        </div>)
    }
}