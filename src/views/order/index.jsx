import React from 'react'
import { Card, Breadcrumb } from 'antd'

import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import List from './list'

import './order.less'

class Order extends React.Component {
    render() {
        return (<div>
            <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>点餐</Breadcrumb.Item>
                <Breadcrumb.Item><span style={{ color: '#f93030' }} >菜单管理</span></Breadcrumb.Item>
            </Breadcrumb>
            <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                <List initalList={{pic: [], names: ['1', '2', '3'], price: ['10', '20', '30']}} />
            </Card>
        </div>)
    }
}

export default Order