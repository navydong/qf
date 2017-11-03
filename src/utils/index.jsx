// 获取url的参数
export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

//处理数据
export const sloveRespData = (dataSource, key) => {
    if( !dataSource ) return;
    dataSource.forEach((item, index) => {
        item['key'] = item[key];
        item['order_id'] = index + 1;
    } )

    return dataSource;
}
//左侧导航栏
export const sliderBar = [{
    "name": "移动支付管理平台",
    "icon": "scan",
    "submenu": [{
        "name": "基础参数",
        "submenu": [{
            "name": "通道信息",
            "url": "/app/foundation/accessMessage"
        },
        {
            "name": "行业类目明细",
            "url": "/app/foundation/category"
        }
        ]
    },
    {
        "name": "机构信息",
        "submenu": [{
            "name": "受理机构信息",
            "url": "/app/organization/slove"
        },
        {
            "name": "服务商信息",
            "url": "/app/organization/service"
        },
        {
            "name": "商户信息",
            "url": "/app/organization/merchant"
        }
        ]
    },
    {
        "name": "设备管理",
        "submenu": [{
            "name": "设备终端信息",
            "url": "/app/equipment/terminal"
        },
        {
            "name": "设备品类信息",
            "url": "/app/equipment/category"
        }
        ]
    },
    {
        "name": "分润管理",
        "submenu": [{
            "name": "分润方案",
            "url": "/app/sharebenefit/program"
        },
        {
            "name": "分润方案明细",
            "url": "/app/sharebenefit/detail"
        },
        {
            "name": "机构分润配置",
            "url": "/app/sharebenefit/config"
        },
        {
            "name": "分润统计",
            "url": "/app/sharebenefit/toggle"
        }
        ]
    },
    {
        "name": "账单核对",
        "submenu": [{
            "name": "微信对账单",
            "url": "/app/bill/wxpay"
        },
        {
            "name": "支付宝对账单",
            "url": "/app/bill/alipay"
        },
        {
            "name": "对账信息",
            "url": "/app/bill/detail"
        }
        ]
    },
    {
        "name": "报表查询",
        "submenu": [{
            "name": "订单查询-明细",
            "url": "/app/reportQuert/tradeBlotter"
        },
        {
            "name": "图表",
            "url": "/app/reportQuert/chart"
        },
        {
            "name": "订单查询-汇总",
            "url": "/app/reportQuert/tradeBalcons"
        },
        {
            "name": "设备分布散点图",
            "url": "/app/reportQuert/scatter"
        }
        ]
    }
    ]
},{
    "name":"基础配置管理",
    "icon":"area-chart",
    "submenu": [{
        "name": "用户管理",
        "url": "/app/user/user"
    },{
        "name": "菜单管理",
        "url": "/app/user/menu"
    },{
        "name": "角色管理",
        "url": "/app/user/userGroup"
    }]
}]
