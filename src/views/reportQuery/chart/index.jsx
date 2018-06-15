import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import '@/style/icon/iconfont.css';
import fmoney from '@/utils/fmoney';
import { Card, Col, Row } from 'antd';
import axios from 'axios';
import React from 'react';
import Bar from './Bar';
import Hour from './Hour';
import Line from './Line';
import CardCuston from './cardCustom';
import './index.less';

class Chart extends React.Component {
    _isMounted = false
    state = {
        today: {},        //当日情况
        hour: {},         //每小时交易
        Top10Money: [],   //top10金额
        Top10Count: [],   //top10笔数
        sameMonth: {},    //当月交易
    }
    componentDidMount() {
        this._isMounted = true
        axios.get('/back/leaderCockpit/findInfo').then(({ data }) => {
            this._isMounted && this.setState({
                today: data.today,
                hour: data.hour,
                Top10Money: data.Top10Money,
                Top10Count: data.Top10Count,
                sameMonth: data.sameMonth,
            })
        }).catch(err=>{
            alert(err)
        })
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    render() {
        const { today, hour, Top10Money, Top10Count, sameMonth } = this.state
        return (
            <div className="chart">
                <BreadcrumbCustom first="报表查询" second="图表" location={this.props.location} />
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
                                        icon="icon-jine"
                                        data={fmoney(today.todaySummer)}
                                        text="今日成交金额"
                                    />
                                </Col>
                                <Col span={6}>
                                    <CardCuston
                                        color="#f9ca66"
                                        count={true}
                                        icon="icon-chengjiaoguanli"
                                        data={today.todayCount}
                                        text="今日成交笔数"
                                    />
                                </Col>
                                <Col span={6}>
                                    <CardCuston
                                        color="#16c2c2"
                                        icon="icon-16c2c2"
                                        data={today.store}
                                        text="已签约门店数"
                                    />
                                </Col>
                                <Col span={6}>
                                    <CardCuston
                                        className={'last-content'}
                                        color="#6fb1f9"
                                        icon="icon-shebei"
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
                                <Line data={sameMonth} style={{ height: '255px', width: '100%' }} />
                            </Card>
                        </Col>
                        <Col span={24} style={{ marginTop: '10px' }}>
                            <Card noHovering>
                                {/* 每小时 */}
                                <Hour data={hour} style={{ height: '255px', width: '100%' }} />
                            </Card>
                        </Col>
                        <Col span={24} style={{ marginTop: '10px' }}>
                            <Card noHovering>
                                {/* top门店 */}
                                <Bar Top10Money={Top10Money}
                                    Top10Count={Top10Count}
                                    style={{ height: '283px', width: '100%' }} />
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default Chart