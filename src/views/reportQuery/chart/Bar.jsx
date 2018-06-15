import { Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import React from 'react';
import { mendianCount, mendianMoney } from './arguments';
const Group = Button.Group


class Line extends React.Component {
    componentDidUpdate() {
        /*
        data[]数据 
        index=0 商户名
        index=1交易额
        index=2交易笔数
        */
        mendianMoney.yAxis.data = this.props.Top10Money[0]
        mendianMoney.series[0].data = this.props.Top10Money[1]

        mendianCount.yAxis.data = this.props.Top10Count[0]
        mendianCount.series[0].data = this.props.Top10Count[1]
        let bar = this.echarts_react.getEchartsInstance();
        bar.setOption(mendianMoney)
    }
    moneyClick = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(mendianMoney)
    }
    countClick = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(mendianCount)
    }
    render() {
        return (
            <div>
                <div className="chart-title3">成交额TOP10门店</div>
                <Group>
                    <Button onClick={this.moneyClick}>日成交金额</Button>
                    <Button onClick={this.countClick}>日成交笔数</Button>
                </Group>
                <ReactEcharts
                    ref={(e) => { this.echarts_react = e; }}
                    option={mendianMoney}
                    style={this.props.style}
                    className={'react_for_echarts'}
                />
            </div>
        )
    }
}


export default Line