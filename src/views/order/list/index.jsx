import React from 'react';
import { Card, Breadcrumb, Button } from 'antd'
import axios from 'axios'
import Order from './Order'

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.notificationPermit = false
        this.state = {
            data: [],
            tableLoading: false
        }
    }
    componentDidMount() {
        // this.getPageList()
    }
    // 浏览器消息推送
    notificat = () => {
        
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
    render() {
        const data = [
            {
                tableNum: 31,
                status: '已出单',
                commnent: '备注',
                nvoice: '发票',
                odertime: '19:20:21',
                products: [
                    { name: '奥尔良咖喱饭', number: 2, price: 20 },
                    { name: '奥尔良咖喱饭', number: 2, price: 20 }
                ]
            },
            {
                tableNum: 31,
                status: '已出单',
                commnent: '备注',
                odertime: '19:20:21',
                nvoice: '发票',
                products: [
                    { name: '奥尔良咖喱饭', number: 2, price: 20 },
                    { name: '奥尔良咖喱饭', number: 2, price: 20 }
                ]
            },
            {
                tableNum: 31,
                status: '已出单',
                commnent: '备注',
                odertime: '19:20:21',
                nvoice: '发票',
                products: [
                    { name: '奥尔良咖喱饭', number: 2, price: 20 },
                    { name: '奥尔良咖喱饭', number: 2, price: 20 }
                ]
            },
            {
                tableNum: 31,
                status: '已出单',
                commnent: '备注',
                odertime: '19:20:21',
                nvoice: '发票',
                products: [
                    { name: '奥尔良咖喱饭', number: 2, price: 20 },
                    { name: '奥尔良咖喱饭', number: 2, price: 20 }
                ]
            },
            {
                tableNum: 31,
                status: '已出单',
                commnent: '备注',
                odertime: '19:20:21',
                nvoice: '发票',
                products: [
                    { name: '奥尔良咖喱饭', number: 2, price: 20 },
                    { name: '奥尔良咖喱饭', number: 2, price: 20 }
                ]
            }
        ]
        return (<div>
            <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>点餐</Breadcrumb.Item>
                <Breadcrumb.Item><span style={{ color: '#f93030' }} >订单管理</span></Breadcrumb.Item>
            </Breadcrumb>
            <Button type="primary" onClick={this.refresh} >刷新</Button>
            <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                {data.map((item, index) => {
                    return <Order record={item} key={index} />
                })}
            </Card>



        </div>)
    }
}