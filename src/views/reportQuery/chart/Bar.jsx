import React from 'react'
import ReactEcharts from 'echarts-for-react';
import { Row, Col } from 'antd'
import { mendian } from './arguments'



class Line extends React.Component {
    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <ReactEcharts
                            ref={(e) => { this.echarts_react = e; }}
                            option={mendian}
                            style={this.props.style}
                            className={'react_for_echarts'}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}


export default Line