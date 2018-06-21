import React from 'react'
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Button, Radio } from 'antd'
import { hour, number } from './arguments'
const Group = Radio.Group
const RadioButton = Radio.Button;

class Line extends React.Component {
    componentDidUpdate() {
        hour.series[0].data = this.props.data.hourSum
        number.series[0].data = this.props.data.hourCount
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(hour)
    }
    hourClick = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(hour)
    }
    numberClick = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(number)
    }
    render() {
        return (
            <div>
                <div className="chart-title2" style={{ borderColor: '' }}>每小时交易情况</div>
                <Group defaultValue="a" >
                    <RadioButton value="a" onClick={this.hourClick}>成交金额</RadioButton>
                    <RadioButton value="b" onClick={this.numberClick}>成交笔数</RadioButton>
                </Group>
                <ReactEcharts
                    ref={(e) => { this.echarts_react = e; }}
                    option={hour}
                    style={this.props.style}
                    className={'react_for_echarts'}
                />
            </div>
        )
    }
}


export default Line