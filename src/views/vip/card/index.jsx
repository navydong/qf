/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-28 13:32:55 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-03-30 16:49:33
 */

import React from 'react'
import axios from 'axios'
import { Card, Col, Row, Upload, Icon, message, Breadcrumb } from 'antd'

import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import CardInfo from './CardInfo'


class VipCard extends React.Component {
    componentDidMount() {
        // this.getAccessToken()
    }

    render() {
        return (
            <div>
                <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item>会员</Breadcrumb.Item>
                    <Breadcrumb.Item><span style={{ color: '#f93030' }} >会员卡</span></Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                <div>
                    <CardInfo />
                </div>
                </Card>
            </div>
        )
    }
}

export default VipCard