import React, { Component } from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import { Row, Col, Card, Button } from 'antd'

import './detail.less'

import BaseTree from './BaseTree'


class Detail extends Component {
    render() {
        return (
            <div className="foundation-detail">
                <BreadcrumbCustom first="基础参数" second="行业明细" />
                <div>
                    <Card>
                        <Row gutter={40}>
                            <Col span={6} push={2} className="rightLine">
                                <BaseTree />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Detail