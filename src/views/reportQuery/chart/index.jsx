import React from 'react'
import { Row, Col, Card, Button } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import Line from './Line'
import Bar from './Bar'
import Hour from './Hour'
import './index.less'

class Chart extends React.Component {
    render() {
        return (
            <div>
                <BreadcrumbCustom first="报表查询" second="图表" />
                <Row gutter={10}>
                    <Col span={4} >
                        <Card 
                        bordered={false}
                        noHovering
                        bodyStyle={{padding: 0}}
                        >
                            <div className="left">
                                <div className="money">
                                    <div className="icon"></div>
                                    <div className="character">
                                        <div className="up">今日成交金额</div>
                                        <div className="all" id="all"></div>
                                    </div>
                                    <div className="moneybottom"></div>
                                </div>
                                <div className="number">
                                    <div className="icon"></div>
                                    <div className="character">
                                        <div className="up">今日成交笔数</div>
                                        <div className="all" id="allNumber"></div>
                                    </div>
                                    <div className="numberbottom"></div>
                                </div>
                                <div className="shoppingNumber">
                                    <div className="icon"></div>
                                    <div className="character">
                                        <div className="up">已签约门店数</div>
                                        <div className="all" id="mendian"></div>
                                    </div>
                                    <div className="shoppingNumberbottom"></div>
                                </div>
                                <div className="equipmentNumber">
                                    <div className="icon"></div>
                                    <div className="character">
                                        <div className="up">已激活设备数</div>
                                        <div className="all" id="equipmentNumber"></div>
                                    </div>
                                    <div className="equipmentNumberbottom"></div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card>
                            <Line style={{ height: '600px', width: '100%' }} />
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Row>
                            <Col>
                                <Card>
                                    <Hour style={{ height: '275px', width: '100%' }} />
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <Bar style={{ height: '275px', width: '100%' }} />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Chart