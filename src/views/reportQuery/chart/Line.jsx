import React from 'react'
import ReactEcharts from 'echarts-for-react';
import axios from 'axios'
import { Row, Col, Button, Card } from 'antd'
import { currenMonth, yearToYear, chain } from './arguments'
const Group = Button.Group


class Line extends React.Component {
    componentDidUpdate() {
        currenMonth.series[0].data = this.props.data.monthCount
        currenMonth.series[1].data = this.props.data.monthSum
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(currenMonth)
    }
    currenMonthClick = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(currenMonth)
    }
    yearToYearClick = () => {
        let line = this.echarts_react.getEchartsInstance();
        let option = {
            series: [
                {
                    data: this.props.data.anMonthCount
                },
                {
                    data: this.props.data.anMonthSum
                }
            ]
        };
        line.setOption(option)
    }
    chainClick = () => {
        let line = this.echarts_react.getEchartsInstance();
        let option = {
            series: [
                {
                    data: this.props.data.momMonthCount
                },
                {
                    data: this.props.data.momMonthSum
                }
            ]
        };
        line.setOption(option)
    }
    render() {
        return (
            <div>
                <div className="chart-title1">当月交易情况</div>
                <Group>
                    <Button onClick={this.currenMonthClick}>当月交易情况</Button>
                    <Button onClick={this.yearToYearClick}>同比</Button>
                    <Button onClick={this.chainClick}>环比</Button>
                </Group>
                <ReactEcharts
                    ref={(e) => { this.echarts_react = e; }}
                    option={currenMonth}
                    style={this.props.style}
                />
            </div>
        )
    }
}

export default Line