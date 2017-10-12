import React, { Component } from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import { Row, Col, Card, Button } from 'antd'

import './detail.less'

import BaseTree from './BaseTree'

const ButtonGroup = Button.Group

class Detail extends Component {
    render() {
        return (
            <div className="foundation-detail">
                <BreadcrumbCustom first="基础参数" second="行业明细" />
                <div>
                    <Card>
                        <Row gutter={40}>
                            <Col span={6} push={2} className="rightLine">
                                <ButtonGroup>
                                    <Button onClick={this.addHandle}>添加</Button>
                                    <Button type="primary" onClick={this.delHandle}>删除</Button>
                                </ButtonGroup>
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