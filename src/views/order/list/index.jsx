import React from 'react';
import { Card, Breadcrumb, Table } from 'antd'
import Skeleton from '../../../skeleton/Skeleton'

export default class List extends React.Component {
    render() {
        const columns = [{
            title: '桌号',
            dataIndex: ''
        }, {
            title: '用户',
            dataIndex: ''
        }, {
            title: '总价',
            dataIndex: ''
        },{
            title: '菜单',
            dataIndex: ''
        }]
        return (<div>
            <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>点餐</Breadcrumb.Item>
                <Breadcrumb.Item><span style={{ color: '#f93030' }} >订单管理</span></Breadcrumb.Item>
            </Breadcrumb>
            <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                <Table
                    columns={columns}
                />
            </Card>
            <Skeleton />
        </div>)
    }
}