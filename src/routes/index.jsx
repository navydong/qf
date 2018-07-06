import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRedirect, Redirect } from 'react-router';
import Loadable from 'react-loadable'

import LoadingComponent from '@/components/Loading'
import asyncComponent from '@/components/AsyncComponent'
import App from '../App';
import Page from '../views/Page';
import NotFound from '../views/NotFound';
import Homepage from '../components/Homepage'

// 机构管理
const Slove = asyncComponent(() => import('../views/organization/slove'))         //受理机构信息
const Service = asyncComponent(() => import('../views/organization/service'))     //服务商信息
const Merchant = asyncComponent(() => import('../views/organization/merchant'))   //商户信息
// 报表查询
const TradeBlotter = asyncComponent(() => import('../views/reportQuery/tradeBlotter'))   //订单汇总
const TradeBalcons = asyncComponent(() => import('../views/reportQuery/tradeBalcons'))   //订单明细
const Scatter = asyncComponent(() => import('../views/reportQuery/scatter'))             //设备分布图
const Chart = asyncComponent(() => import('../views/reportQuery/chart'))                 //统计图表
const Refund = asyncComponent(() => import('../views/reportQuery/refund'))               //退款
// 账单核对
const BilDetail = asyncComponent(() => import('../views/checkBill/bilDetail'))    //对账信息
// 清分管理
const BenefitQuery = asyncComponent(() => import('../views/benefit/query'))    //对账信息
// 分润管理
const Program = asyncComponent(() => import('../views/shareBenefit/program'))    //对账信息
const ShareConfig = asyncComponent(() => import('../views/shareBenefit/shareConfig'))    //对账信息
const Toggle = asyncComponent(() => import('../views/shareBenefit/toggle'))    //对账信息
// 设备管理
const EquipCategory = asyncComponent(() => import('../views/equipment/equipCategory'))    //对账信息
const EquipTerminal = asyncComponent(() => import('../views/equipment/equipTerminal'))    //对账信息
const Qr = asyncComponent(() => import('../views/equipment/qr'))    //对账信息
// 基础参数
const CategoryInfo = asyncComponent(() => import('../views/foundation/category'))    //对账信息
const AccessMessage = asyncComponent(() => import('../views/foundation/accessMessage'))    //对账信息
// 上传
const Upload = asyncComponent(() => import('../views/upload/upload'))    //对账信息
// 权限管理
const Users = asyncComponent(() => import('../views/user/users'))    //用户管理
const UserGroup = asyncComponent(() => import('../views/user/userGroup'))    //角色管理
const Menu = asyncComponent(() => import('../views/user/menu'))    //菜单管理
const WxManager = asyncComponent(() => import('../views/user/wxManager'))    //小程序
// 会员卡
const ActivityInfo = asyncComponent(() => import('../views/vip/activityInfo'))   //活动管理
const MemberMark = asyncComponent(() => import('../views/vip/memberMark'))       //支付即会员
const Card = asyncComponent(() => import('../views/vip/card'))                   //会员卡
const Members = asyncComponent(() => import('../views/vip/members'))             //会员管理
// 点餐
const OrderCategory = asyncComponent(() => import('../views/order/category'))          //品类管理
const List = asyncComponent(() => import('../views/order/list'))                  //订单
const Product = asyncComponent(() => import('../views/order/product'))            //菜单管理

export default class CRouter extends Component {
    requireAuth = (nextState, replace) => {
        // replace({ pathname: '/app/' })
    }
    render() {
        return (
            <Router history={hashHistory}>
                <Route path={'/'} components={Page}>
                    <IndexRedirect to="app/home" />
                    <Route path="app" component={App} onEnter={this.requireAuth} >
                        <Route path="home" component={Homepage} />
                        <Route path="organization">
                            <Route path="merchant" component={Merchant} />
                            <Route path="slove" component={Slove} />
                            <Route path="service" component={Service} />
                        </Route>
                        <Route path="foundation">
                            <Route path="categoryInfo" component={CategoryInfo} />
                            <Route path="accessMessage" component={AccessMessage} />
                        </Route>
                        <Route path="equipment">
                            <Route path="category" component={EquipCategory} />
                            <Route path="terminal" component={EquipTerminal} />
                            <Route path="qr" component={Qr} />
                        </Route>
                        <Route path={"benefit"}>
                            <Route path={"query"} component={BenefitQuery} />
                        </Route>
                        <Route path={"upload"}>
                            <Route path={"upload"} component={Upload} />
                        </Route>
                        <Route path="sharebenefit">
                            <Route path="program" component={Program} />
                            <Route path="config" component={ShareConfig} />
                            <Route path="toggle" component={Toggle} />
                        </Route>
                        <Route path="bill">
                            <Route path="billDetail" component={BilDetail} />
                        </Route>
                        <Route path="reportQuert">
                            <Route path="tradeBlotter(/:id)" component={TradeBlotter} />
                            <Route path="tradeBalcons" component={TradeBalcons} />
                            <Route path="chart" component={Chart} />
                            <Route path="scatter" component={Scatter} />
                            <Route path="refund" component={Refund} />
                        </Route>
                        <Route path="user">
                            <Route path="users" component={Users} />
                            <Route path="menu" component={Menu} />
                            <Route path="userGroup" component={UserGroup} />
                            <Route path="wxManager" component={WxManager} />
                        </Route>
                        <Route path="vip" >
                            <Route path="card" component={Card} />
                            <Route path="members" component={Members} />
                            <Route path="mark(/:id)" component={MemberMark} />
                            <Route path="activity" component={ActivityInfo} />
                        </Route>
                        <Route path="order">
                            <Route path="product" component={Product} />
                            <Route path="category" component={OrderCategory} />
                            <Route path="list" component={List} />
                        </Route>
                    </Route>
                    <Route path='404' component={NotFound} />
                    <Redirect from='*' to='/404' />
                </Route>
            </Router>
        )
    }
}
