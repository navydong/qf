import React from 'react'
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Button } from 'antd'
import { currenMonth, yearToYear, chain } from './arguments'



class Line extends React.Component {
    click0 = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(currenMonth)
    }
    click1 = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(yearToYear)
    }
    click2 = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(chain)
    }
    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <ReactEcharts
                            ref={(e) => { this.echarts_react = e; }}
                            option={currenMonth}
                            style={this.props.style}
                            className={'react_for_echarts'}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center" style={{ marginTop: 10 }}>
                    <Col>
                        <Button type="primary" onClick={this.click0}>当月交易情况</Button>
                        <Button type="primary" onClick={this.click1}>同比</Button>
                        <Button type="primary" onClick={this.click2}>环比</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}


export default Line