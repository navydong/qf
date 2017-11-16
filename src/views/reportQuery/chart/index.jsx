import React from 'react'
import { Row, Col, Card, Button } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import axios from 'axios'
import Line from './Line'
import Bar from './Bar'
import Hour from './Hour'
import CardCuston from './card'
import './index.less'
import '../../../style/icon/iconfont.css'


class Chart extends React.Component {
    state = {
        today: {},        //当日情况
        hour: {},         //每小时交易
        Top10Money: {},   //top10门店
        sameMonth: {},    //当月交易
    }
    componentDidMount() {
        axios.get('/back/leaderCockpit/findInfo').then(res => res.data).then(res => {
            console.log(res)
            if (typeof res === 'string') {
                return
            }
            this.setState({
                today: res.today || 0,
                hour: res.hour || 0,
                Top10Money: res.Top10Money || 0,
                sameMonth: res.sameMonth || 0,
            })
        })
    }
    render() {
        const { today, hour, Top10Money, sameMonth } = this.state
        return (
            <div className="chart">
                <BreadcrumbCustom first="报表查询" second="图表" />
                <Row gutter={10}>
                    <Col span={24} >
                        <Card
                            noHovering
                            style={{ backgroundColor: '#f8f8f8' }}
                            bordered={false}
                        >
                            <Row>
                                <Col span={6}>
                                    <CardCuston
                                        color="#f93030"
                                        money={true}
                                        data={today.todaySummer}
                                        text="今日成交金额"
                                    />
                                </Col>
                                <Col span={6}>
                                    <CardCuston
                                        color="#f9ca66"
                                        data={today.todayCount}
                                        text="今日成交笔数"
                                    />
                                </Col>
                                <Col span={6}>
                                    <CardCuston
                                        color="#16c2c2"
                                        data={today.store}
                                        text="已签约门店数"
                                    />
                                </Col>
                                <Col span={6}>
                                    <CardCuston
                                        color="#6fb1f9"
                                        data={today.device}
                                        text="已激活设备数"
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Card
                    noHovering
                    bordered={false}
                    style={{ backgroundColor: '#f8f8f8', marginTop: '10px' }}
                >
                    <Row>
                        <Col span={24}>
                            <Card noHovering>
                                {/* 当月 */}
                                <Line style={{ height: '255px', width: '100%' }} data={sameMonth} />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <div style={{ marginTop: '10px' }}>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Card
                                            noHovering

                                        >
                                            {/* 每小时 */}
                                            <Hour style={{ height: '255px', width: '100%' }} data={hour} />
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card
                                            noHovering

                                        >
                                            {/* top门店 */}
                                            <Bar style={{ height: '255px', width: '100%' }} data={Top10Money} />
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default Chart
