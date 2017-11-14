import React from 'react'
import ReactEcharts from 'echarts-for-react';
import { Row, Col } from 'antd'
import { mendian } from './arguments'



class Line extends React.Component {
    componentDidUpdate(){
        /* 
        第一个商户名
        第二个交易额
        第三个交易笔数
        */
        mendian.yAxis.data = this.props.data[0]
        mendian.series.forEach((item, index) => {
            if (index === 0) {
                item.data = this.props.data[1]
            } else {
                item.data = this.props.data[2]
            }
        })
        let bar = this.echarts_react.getEchartsInstance();
        bar.setOption(mendian)
    }
    render() {
        return (
            <div>
                <div className="chart-title1">成交额TOP10门店</div>
                <div style={{height: 28}}>
                    
                </div>
                <ReactEcharts
                    ref={(e) => { this.echarts_react = e; }}
                    option={mendian}
                    style={this.props.style}
                    className={'react_for_echarts'}
                />
            </div>
        )
    }
}


export default Line