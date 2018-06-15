/*
 * @Author: yss.donghaijun 
 * @Date: 2018-05-24 13:43:03 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-05-28 11:37:48
 */

// 当月交易情况
var currenMonth = {
    tooltip: {
        trigger: 'axis',
        formatter: '当月{b}日<br/>{a0}: {c0}<br />{a1}: {c1}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)",
    },
    grid: {
        top: '30px',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        axisLabel: {
            rotate: 0,
        }
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
        },
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
            name: '成交笔数',
            type: 'line',
            stack: '总量',
            symbolSize: 0.1,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#6fb1f9'
                    }
                }
            },
            data: []
        },
        {
            name: '成交金额',
            type: 'line',
            stack: '总量',
            symbolSize: 0.1,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#16c2c2'
                    }
                }
            },
            data: []
        }
    ]
};
// 同比
var yearToYear = {
    series: [{
            data: []
        },
        {
            data: []
        }
    ]
};
// 环比
var chain = {
    series: [{
            data: []
        },
        {
            data: []
        }
    ]
};
// 门店TOP10成交金额
var mendianMoney = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    // legend: {
    //     data: ['日成交金额', '日成交笔数'],
    //     right: "0",
    //     padding: [0, 0, 28, 0]
    // },
    grid: {
        top: '30px',
        left: '3%',
        right: '4%',
        bottom: '6%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLine: {
            show: false
        },
        axisLabel: {
            show: true
            // interval:1,
            // rotate: 20
        }
    },
    yAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
        },
    },
    series: [{
            name: '日成交金额',
            type: 'bar',
            data: [],
            itemStyle: {
                normal: {
                    color: "#6fb1f9"
                }
            },
            barWidth: 5,
            barGap: 0
        },
        // {
        //     name: '日成交金额',
        //     type: 'bar',
        //     data: [],
        //     itemStyle: {
        //         normal: {
        //             color: "#16c2c2"
        //         }
        //     },
        //     barWidth: 5
        // }
    ]
};
// 门店TOP10成交笔数
var mendianCount = {
    yAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
        },
    },
    series: [{
        name: '日成交笔数',
        type: 'bar',
        data: [],
        itemStyle: {
            normal: {
                color: "#16c2c2"
            }
        },
        barWidth: 5
    }]
}

// 每小时成交金额
var hour = {
    tooltip: {
        trigger: 'axis',
        formatter: '当日{b}:00<br/>{a0}: {c0}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)",
    },
    legend: {
        data: ['成交金额'],
        bottom: -30
    },
    grid: {
        top: '30px',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0', '1', '2', '3', '4', '5', '6', "7", '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    },
    yAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
        name: '成交金额',
        type: 'line',
        stack: '总量',
        symbolSize: 0.1,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#f9ca66'
                }
            }
        },
        data: []
    }]
};
// 每小时成交笔数
var number = {
    tooltip: {
        formatter: '当日{b}:00<br/>{a0}: {c0}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)"
    },
    legend: {
        data: ['成交笔数'],
        bottom: -30
    },
    grid: {
        top: '30px',
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0', '1', '2', '3', '4', '5', '6', "7", '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],

    },
    yAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
        name: '成交笔数',
        type: 'line',
        stack: '总量',
        symbolSize: 0.1,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#6fb1f9'
                }
            }
        },
        data: []
    }]
};

export {
    currenMonth,
    yearToYear,
    chain,
    mendianMoney,
    mendianCount,
    hour,
    number
}