import { combineReducers } from 'redux';
import auth from './auth'
import * as type from '../actions/type';
import axios from 'axios'

const handleData = (state = {isFetching: true, data: {}}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};
        default:
            return {...state};
    }
};
const httpData = (state = {}, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return {...state};
    }
};

let menuList = [
    {
    id: "c6650879bf634ee982bf1796fd1cafd7",
    parentId: "-1",
    children: [
    {
    id: "f21634c869324f558e773438038202c6",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "08793b93b92247a1b19f41bc06d7dd87",
    parentId: "f21634c869324f558e773438038202c6",
    children: [ ],
    title: "受理机构信息",
    href: "/app/organization/slove",
    code: "slove",
    path: "/app/organization/slove",
    orderNum: 2,
    spread: false
    },
    {
    id: "95d62e51a73f42599fe3186b4161432d",
    parentId: "f21634c869324f558e773438038202c6",
    children: [ ],
    title: "服务商信息",
    href: "/app/organization/service",
    code: "service",
    path: "/app/organization/service",
    orderNum: 3,
    spread: false
    },
    {
    id: "5f535724da974dada8ce17fdb1042a43",
    parentId: "f21634c869324f558e773438038202c6",
    children: [ ],
    title: "商户信息",
    href: "/app/organization/merchant",
    code: "merchant",
    path: "/app/organization/merchant",
    orderNum: 4,
    spread: false
    }
    ],
    title: "机构管理",
    code: "organization",
    path: "/app/organization",
    orderNum: 1,
    spread: false
    },
    {
    id: "a0340083e90d486f9e703d7822a91b14",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "a191bef01b944f2b85cabedc4f519bba",
    parentId: "a0340083e90d486f9e703d7822a91b14",
    children: [ ],
    title: "订单查询-明细",
    href: "/app/reportQuert/tradeBlotter",
    code: "tradeBlotter",
    path: "/app/reportQuert/tradeBlotter",
    orderNum: 6,
    spread: false
    },
    {
    id: "e929f6e15f5a4789bd01c92cee240c60",
    parentId: "a0340083e90d486f9e703d7822a91b14",
    children: [ ],
    title: "订单查询-汇总",
    href: "/app/reportQuert/tradeBalcons",
    code: "tradeBalcons",
    path: "/app/reportQuert/tradeBalcons",
    orderNum: 7,
    spread: false
    },
    {
    id: "bb179f7f123248359b6cb897f130bb0e",
    parentId: "a0340083e90d486f9e703d7822a91b14",
    children: [ ],
    title: "设备分布图",
    href: "/app/reportQuert/scatter",
    code: "scatter",
    path: "/app/reportQuert/scatter",
    orderNum: 8,
    spread: false
    },
    {
    id: "001fb43da6014bca894a2f35b10904dc",
    parentId: "a0340083e90d486f9e703d7822a91b14",
    children: [ ],
    title: "统计图表",
    href: "/app/reportQuert/chart",
    code: "chart",
    path: "/app/reportQuert/chart",
    orderNum: 9,
    spread: false
    }
    ],
    title: "报表查询",
    code: "reportQuert",
    path: "/app/reportQuert",
    orderNum: 5,
    spread: false
    },
    {
    id: "8310001123184bf99c04bcd9769b89e8",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "067da95dbfe4420f8e4ccb3a766d473f",
    parentId: "8310001123184bf99c04bcd9769b89e8",
    children: [ ],
    title: "对账信息",
    href: "/app/bill/detail",
    code: "billDetail",
    path: "/app/bill/billDetail",
    orderNum: 11,
    spread: false
    }
    ],
    title: "账单核对",
    code: "bill",
    path: "/app/bill",
    orderNum: 10,
    spread: false
    },
    {
    id: "b089fb7baaac4b8ab22d90d1f3ab954f",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "eba61047c6bd4c47abada6cde565afb6",
    parentId: "b089fb7baaac4b8ab22d90d1f3ab954f",
    children: [ ],
    title: "清分数据查询",
    href: "/app/benefit/query",
    code: "query",
    path: "/app/benefit/query",
    orderNum: 13,
    spread: false
    }
    ],
    title: "清分管理",
    code: "benefit",
    path: "/app/benefit",
    orderNum: 12,
    spread: false
    },
    {
    id: "24dd2b49b78647cfa9650c2700907c4d",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "075b62b19b0540678467ad37eaa0cbf2",
    parentId: "24dd2b49b78647cfa9650c2700907c4d",
    children: [ ],
    title: "分润方案",
    href: "/app/sharebenefit/program",
    code: "program",
    path: "/app/sharebenefit/program",
    orderNum: 15,
    spread: false
    },
    {
    id: "e1f7d3454256423fba1bc7b68fcfcbf3",
    parentId: "24dd2b49b78647cfa9650c2700907c4d",
    children: [ ],
    title: "机构分润配置",
    href: "/app/sharebenefit/config",
    code: "orgQueryConfig",
    path: "/app/sharebenefit/orgQueryConfig",
    orderNum: 16,
    spread: false
    },
    {
    id: "d01e4b16549e49f38b8fbb1f9195e7a1",
    parentId: "24dd2b49b78647cfa9650c2700907c4d",
    children: [ ],
    title: "分润统计",
    href: "/app/sharebenefit/toggle",
    code: "queryToggle",
    path: "/app/sharebenefit/queryToggle",
    orderNum: 17,
    spread: false
    },
    {
    id: "2db8a093a0014076bea701f77af52894",
    parentId: "24dd2b49b78647cfa9650c2700907c4d",
    children: [ ],
    title: "分润方案明细",
    href: "/app/sharebenefit/detail",
    code: "detail",
    path: "/app/sharebenefit/detail",
    orderNum: 30,
    spread: false
    }
    ],
    title: "分润管理",
    code: "sharebenefit",
    path: "/app/sharebenefit",
    orderNum: 14,
    spread: false
    },
    {
    id: "dd3cd527a83d4392a81427d64f732123",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "9999d467004d4d1b81be583feae0363d",
    parentId: "dd3cd527a83d4392a81427d64f732123",
    children: [ ],
    title: "设备品类信息",
    href: "/app/equipment/category",
    code: "category",
    path: "/app/equipment/category",
    orderNum: 19,
    spread: false
    },
    {
    id: "8f925029ee7445719f31822c5b6583e9",
    parentId: "dd3cd527a83d4392a81427d64f732123",
    children: [ ],
    title: "设备终端信息",
    href: "/app/equipment/terminal",
    code: "terminal",
    path: "/app/equipment/terminal",
    orderNum: 20,
    spread: false
    },
    {
    id: "e87ccee289874f109314512b6ceec9a9",
    parentId: "dd3cd527a83d4392a81427d64f732123",
    children: [ ],
    title: "二维码管理",
    href: "/app/equipment/qr",
    code: "qr",
    path: "/app/equipment/qr",
    orderNum: 21,
    spread: false
    }
    ],
    title: "设备管理",
    code: "equipment",
    path: "/app/equipment",
    orderNum: 18,
    spread: false
    },
    {
    id: "fd50e931dff04f6b92c13839b7ba0961",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "63cc159613fc453cb46e472671692d0b",
    parentId: "fd50e931dff04f6b92c13839b7ba0961",
    children: [ ],
    title: "行业类目信息",
    href: "/app/foundation/category",
    code: "category",
    path: "/app/foundation/category",
    orderNum: 23,
    spread: false
    }
    ],
    title: "基础参数",
    code: "foundation",
    path: "/app/foundation",
    orderNum: 22,
    spread: false
    },
    {
    id: "9dbfbd6ecf1346699531c38672b15efe",
    parentId: "c6650879bf634ee982bf1796fd1cafd7",
    children: [
    {
    id: "88b067642dc04d4a879f6dae48173211",
    parentId: "9dbfbd6ecf1346699531c38672b15efe",
    children: [ ],
    title: "上传文件",
    href: "/app/upload/upload",
    code: "fileUpload",
    path: "/app/upload/fileUpload",
    orderNum: 25,
    spread: false
    }
    ],
    title: "上传",
    code: "upload",
    path: "/app/upload",
    orderNum: 24,
    spread: false
    }
    ],
    icon: "scan",
    title: "移动支付管理平台",
    code: "app",
    path: "/app",
    orderNum: 0,
    spread: false
    },
    {
    id: "1f99cb6f4594486a8a70060769c35ab1",
    parentId: "-1",
    children: [
    {
    id: "2fe34ae60600477d89f19f3eb9f8b881",
    parentId: "1f99cb6f4594486a8a70060769c35ab1",
    children: [ ],
    title: "角色管理",
    href: "/app/user/userGroup",
    code: "userGroup",
    path: "/baseConfig/userGroup",
    orderNum: 27,
    spread: false
    },
    {
    id: "cd4b59b9f236431dbf7da4150684c22e",
    parentId: "1f99cb6f4594486a8a70060769c35ab1",
    children: [ ],
    title: "用户管理",
    href: "/app/user/user",
    code: "user",
    path: "/baseConfig/user",
    orderNum: 28,
    spread: false
    },
    {
    id: "88d9a2df196741fdb6721a2731f619de",
    parentId: "1f99cb6f4594486a8a70060769c35ab1",
    children: [ ],
    title: "菜单管理",
    href: "/app/user/menu",
    code: "menu",
    path: "/baseConfig/menu",
    orderNum: 29,
    spread: false
    }
    ],
    icon: "area-chart",
    title: "权限管理",
    href: "",
    code: "baseConfig",
    path: "/baseConfig",
    orderNum: 26,
    spread: false
    }
    ]


const menu = (state = {}, action)=>{
    return {
        ...state, 
        menuList
    }
}


export default combineReducers({
    httpData,
    auth,
    menu,
});
