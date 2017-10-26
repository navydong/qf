import React from 'react'
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Button } from 'antd'
import { hour, number } from './arguments'



class Line extends React.Component {
    click0 = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(hour)
    }
    click1 = () => {
        let line = this.echarts_react.getEchartsInstance();
        line.setOption(number)
    }
    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <ReactEcharts
                            ref={(e) => { this.echarts_react = e; }}
                            option={hour}
                            style={this.props.style}
                            className={'react_for_echarts'}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center" style={{ marginTop: 10 }}>
                    <Col>
                        <Button type="primary" onClick={this.click0}>成交金额</Button>
                        <Button type="primary" onClick={this.click1}>成交笔数</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}


export default Line