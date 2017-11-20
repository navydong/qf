var initialdata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// var data5InitNUMS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var data5InitNUMS = []
var data5InitSUMMER = []
for (let i = 0; i < 31; i++) {
    let randomNum = Math.floor(Math.random() * 10 + 10)
    data5InitNUMS.push(randomNum)
    data5InitSUMMER.push(randomNum * (Math.random() * 10 + 1))
}

// var data6InitSummerHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// var data6InitNumsHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var data6InitSummerHour = [],
    data6InitNumsHour = []
for (let i = 0; i < 31; i++) {
    let randomNum = Math.floor(Math.random() * 10 + 10)
    data6InitSummerHour.push(randomNum)
    data6InitNumsHour.push(randomNum * (Math.random() * 10 + 1))
}
// var data7InitNameTop = ['门店名称', '2', '', '', '', '', '', '', '', ''];
// var data7InitNumsTop = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// var data7InitSummerTop = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var data7InitSummerTop = [],
    data7InitNameTop = [],
    data7InitNumsTop = []
for (let i = 0; i < 7; i++) {
    let randomNum = Math.floor(Math.random() * 10 + 1)
    data7InitNameTop.push('门店' + (i + 1))
    data7InitNumsTop.push(randomNum)
    data7InitSummerTop.push(randomNum * (1 + Math.random()))
}


var currenMonth = {
    // title: {
    //     text: '当月交易情况',
    //     top: -5,
    //     right: 'center',
    //     textStyle: {
    //         fontWeight: "normal"
    //     }
    // },
    tooltip: {
        trigger: 'axis',
        formatter: '当月{b}日<br/>{a0}: {c0}<br />{a1}: {c1}',
        padding: [5, 20],
        backgroundColor: "rgba(27,27,27,0.5)"
    },
    // legend: {
    //     data: ['成交笔数', '成交金额'],
    //     top: 0,
    //     right: 0
    // },
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
            // interval: 1,
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
var yearToYear = {
    series: [
        {
            data: []
        },
        {
            data: []
        }
    ]
};
var chain = {
    series: [{
            data: []
        },
        {
            data: []
        }
    ]
};
var mendian = {
    // title: {
    //     text: '成交额TOP10门店',
    //     left: "0",
    //     textStyle: {
    //         fontWeight: "normal",
    //         fontSize: 16,
    //     }

    // },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['日成交金额', '日成交笔数'],
        right: "0",
        padding: [0, 0, 28, 0]
    },
    grid: {
        top: '30px',
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
        data: [],
        axisLabel: {
            interval: 0,
            // rotate: 30
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
            barWidth: 5
        },
        {
            name: '日成交笔数',
            type: 'bar',
            data: [],
            itemStyle: {
                normal: {
                    color: "#16c2c2"
                }
            },
            barWidth: 5,
            barGap: 0
        }
    ]
};
var hour = {
    // title: {
    //     text: '每小时交易情况',
    //     subtext: '（成交金额）',
    //     top: -5,
    //     textAlign: "center",
    //     left: "50%",
    //     textStyle: {
    //         fontWeight: "normal"
    //     },
    //     subtextStyle: {
    //         color: "#343a40",
    //         fontSize: 16
    //     }
    // },
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
var number = {
    // title: {
    //     text: '每小时交易情况',
    //     subtext: '（成交笔数）',
    //     textAlign: "center",
    //     left: "50%",
    //     top: -5,
    //     right: 250,
    //     textStyle: {
    //         fontWeight: "normal",
    //     },
    //     subtextStyle: {
    //         color: "#343a40",
    //         fontSize: 16
    //     }
    // },
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
    mendian,
    hour,
    number
}