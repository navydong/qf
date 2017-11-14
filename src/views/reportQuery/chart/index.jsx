import React from 'react'
import { Row, Col, Card, Button } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import axios from 'axios'
import Line from './Line'
import Bar from './Bar'
import Hour from './Hour'
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
                today: res.today,
                hour: res.hour,
                Top10Money: res.Top10Money,
                sameMonth: res.sameMonth,
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
                                    <div className="content clear">
                                        <div className="left">
                                            <i className="iconfont icon-jine" style={{ color: '#f93030' }}></i>
                                        </div>
                                        <div className="right">
                                            <div className="up">￥{today.todaySummer}</div>
                                            <div className="all">今日成交金额</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="content clear">
                                        <div className="left">
                                            <i className="iconfont icon-chengjiaoguanli" style={{ color: '#f9ca66' }}></i>
                                        </div>
                                        <div className="right">
                                            <div className="up">{today.todayCount}</div>
                                            <div className="all">今日成交笔数</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="content clear">
                                        <div className="left">
                                            <i className="iconfont icon-16c2c2" style={{ color: '#16c2c2' }}></i>
                                        </div>
                                        <div className="right">
                                            <div className="up">{today.store}</div>
                                            <div className="all">已签约门店数</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="last-content clear">
                                        <div className="left">
                                            <i className="iconfont icon-shebei" style={{ color: '#6fb1f9' }}></i>
                                        </div>
                                        <div className="right">
                                            <div className="up">{today.device}</div>
                                            <div className="all">已激活设备数</div>
                                        </div>
                                    </div>
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
