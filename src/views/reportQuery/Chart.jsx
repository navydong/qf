import React from 'react'
import { Row, Col, Card } from 'antd'
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import axios from 'axios'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'

let xData = []
for (let i = 1; i < 32; i++) {
    xData.push(`当月${i.toString()}日`)
}

// 模拟数据
let data1 = []
let data2 = []
for (let i = 1; i < 32; i++) {
    data1.push(parseInt(Math.random() * 250, 10))
    data2.push(parseInt(Math.random() * 250, 10))
}
const option = {
    title: {
        text: '当月交易情况',
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['成交笔数', '成交金额'],
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '成交笔数',
            type: 'line',
            stack: '总量',
            data: data1
        },
        {
            name: '成交金额',
            type: 'line',
            stack: '总量',
            data: data2
        }
    ]
};
const option2 = {
    title: {
        text: '成交额TOP10门店',
        subtext: '数据来自**'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['日成交金额', '日成交笔数']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: [1,2,3,4,5,6,7,8,9,10]
    },
    series: [
        {
            name: '日成交金额',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230,32034 ]
        },
        {
            name: '日成交笔数',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
        }
    ]
};


class Chart extends React.Component {
    componentDidMount() {
        axios.get('/back/leaderCockpit/findInfo').then((res) => {
            console.log(res)
        })
    }
    render() {
        return (
            <div>
                <BreadcrumbCustom first="报表查询" second="图表" />
                <Row gutter={40}>
                    <Col span={12}>
                        <Card>
                            <ReactEcharts option={option}
                                style={{ height: '300px', width: '100%' }}
                                className={'react_for_echarts'}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <ReactEcharts option={option2}
                                style={{ height: '300px', width: '100%' }}
                                className={'react_for_echarts'}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Chart