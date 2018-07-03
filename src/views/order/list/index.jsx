import React from 'react';
import { Card, Button, Tabs } from 'antd'
import axios from 'axios'
import Order from './Order'

const TabPane = Tabs.TabPane;
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
        const data = []
        for (let i = 0; i < 10; i++) {
            data.push(
                {
                    id: i,
                    tableNum: i + 1 + "0",
                    status: '已出单',
                    commnent: '备注',
                    nvoice: '发票',
                    odertime: '19:20:21',
                    products: [
                        { name: '奥尔良咖喱饭', number: 2, price: 20 },
                        { name: '奥尔良咖喱饭', number: 2, price: 20 }
                    ]
                }
            )
        }
        this.setState({
            data
        })
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
    // 关闭订单
    close = (id) => {
        this.setState(preState => ({
            data: preState.data.filter(item => item.id !== id)
        }))
    }
    render() {
        const { data } = this.state
        return (<div className="list" >
            <Tabs type="card" defaultActiveKey="1">
                <TabPane tab="新订单" key="1">
                    <div className="pane-card" >
                        {/* <Button type="primary" onClick={this.refresh} >刷新</Button> */}
                        {data.map((item, index) => {
                            return <Order record={item} key={item.id} close={this.close} />
                        })}
                    </div>

                </TabPane>
                <TabPane tab="历史订单" key="2">历史订单</TabPane>
                <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
            </Tabs>


        </div>)
    }
}