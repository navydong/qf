import React, { Component } from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import { Row, Col, Card, Spin } from 'antd'

import './detail.less'

import BaseTree from './BaseTree'
import BaseForm from './BaseForm'

class Detail extends Component {
    state = {
        loading: true,
        initialValue: {name: '', rate: '', period: ''}
    }
    set = ()=>{
        this.setState({
            loading: false
        })
    }
    switch = (newData)=>{
        this.setState({
            initialValue: newData
        })
    }
    render() {
        const { loading } = this.state
        return (
            <div className="foundation-detail">
                <BreadcrumbCustom first="基础参数" second="行业明细" />
                <div>
                    <Card>
                        <Row gutter={40}>
                            <Col span={6} push={2} className="rightLine">
                                <BaseTree loading={loading} set={this.set} switch={this.switch} />
                                { loading ? <Spin style={{ marginTop: 30, marginLeft: 30 }} /> : null }
                            </Col>
                            <Col span={13} push={3}>
                                <BaseForm initialValue={ this.state.initialValue } />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Detail