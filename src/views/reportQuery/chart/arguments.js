var data5InitSUMMER = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var data5InitNUMS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var data6InitSummerHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var data6InitNumsHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var data7InitNameTop = ['', '', '', '', '', '', '', '', '', ''];
var data7InitNumsTop = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var data7InitSummerTop = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currenMonth = {
    title: {
        text: '当月交易情况',
        top: -5,
        right: 'center',
        textStyle: {
            fontWeight: "normal"
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: '当月{b}日<br/>{a0}: {c0}<br />{a1}: {c1}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)"
    },
    legend: {
        data: ['成交笔数', '成交金额'],
        top: 0,
        right: 0
    },
    grid: {
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
            interval: 0,
        },
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
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
                        color: '#6cb1ad'
                    }
                }
            },
            data: data5InitNUMS
        },
        {
            name: '成交金额',
            type: 'line',
            stack: '总量',
            symbolSize: 0.1,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#c57851'
                    }
                }
            },
            data: data5InitSUMMER
        }
    ]
};
var yearToYear = {
    title: {
        text: '当月交易情况',
        top: -5,
        right: 'center',
        textStyle: {
            fontWeight: "normal"
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: '当月{b}日<br/>{a0}: {c0}<br />{a1}: {c1}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)"
    },
    legend: {
        data: ['成交笔数', '成交金额'],
        top: 0,
        right: 0
    },
    grid: {
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
            interval: 0,
        },
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
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
                        color: '#c57851'
                    }
                }
            },
            data: [42, 40, 100, 130, 40, 90, 110, 130, 100, 20, 60, 80, 85, 105, 100, 40, 60, 42, 40, 100, 130, 40, 90, 110, 130, 100, 50, 70, 90, 95, 85]
        },
        {
            name: '成交金额',
            type: 'line',
            stack: '总量',
            symbolSize: 0.1,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#6cb1ad'
                    }
                }
            },
            data: [42, 50, 70, 100, 30, 70, 80, 100, 70, 20, 40, 80, 85, 95, 40, 30, 50, 52, 80, 70, 100, 40, 80, 70, 60, 80, 30, 60, 80, 75, 95]
        }
    ]
};
var chain = {
    title: {
        text: '当月交易情况',
        top: -5,
        right: 'center',
        textStyle: {
            fontWeight: "normal"
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: '当月{b}日<br/>{a0}: {c0}<br />{a1}: {c1}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)"
    },
    legend: {
        data: ['成交笔数', '成交金额'],
        top: 0,
        right: 0
    },
    grid: {
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
            interval: 0,
        },
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
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
                        color: '#c57851'
                    }
                }
            },
            data: [50, 32, 30, 90, 120, 30, 80]
        },
        {
            name: '成交金额',
            type: 'line',
            stack: '总量',
            symbolSize: 0.1,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#6cb1ad'
                    }
                }
            },
            data: [10, 100, 120, 50, 70, 30]
        }
    ]
};
var mendian = {
    title: {
        text: '成交额TOP10门店',
        left: "0",
        textStyle: {
            fontWeight: "normal"
        }

    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['日成交金额', '日成交笔数'],
        right: "0"
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLine: {
            show: false
        }
    },
    yAxis: {
        type: 'category',
        data: data7InitNameTop,
        axisLabel: {
            interval: 0,
            rotate: 30
        },
    },
    series: [{
            name: '日成交金额',
            type: 'bar',
            data: data7InitSummerTop,
            itemStyle: {
                normal: {
                    color: "#6cb1ad"
                }
            },
            barWidth: 5
        },
        {
            name: '日成交笔数',
            type: 'bar',
            data: data7InitNumsTop,
            itemStyle: {
                normal: {
                    color: "#c57851"
                }
            },
            barWidth: 5,
            barGap: 0
        }
    ]
};
var hour = {
    title: {
        text: '每小时交易情况',
        subtext: '（成交金额）',
        top: -5,
        textAlign: "center",
        left: "50%",
        textStyle: {
            fontWeight: "normal"
        },
        subtextStyle: {
            color: "#343a40",
            fontSize: 16
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: '当日{b}:00<br/>{a0}: {c0}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)"
    },
    legend: {
        data: ['成交金额'],
        bottom: -30
    },
    grid: {
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
    },
    series: [{
        name: '成交金额',
        type: 'line',
        stack: '总量',
        symbolSize: 0.1,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#c57851'
                }
            }
        },
        data: data6InitSummerHour
    }]
};
var number = {
    title: {
        text: '每小时交易情况',
        subtext: '（成交笔数）',
        textAlign: "center",
        left: "50%",
        top: -5,
        right: 250,
        textStyle: {
            fontWeight: "normal",
        },
        subtextStyle: {
            color: "#343a40",
            fontSize: 16
        }
    },
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
    },
    series: [{
        name: '成交笔数',
        type: 'line',
        stack: '总量',
        symbolSize: 0.1,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#6cb1ad'
                }
            }
        },
        data: data6InitNumsHour
    }]
};

export {
    currenMonth,
    yearToYear,
    chain,
    mendian,
    hour,
    number
}