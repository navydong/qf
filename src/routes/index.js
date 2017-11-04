import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import App from '../App';
import Page from '../views/Page';
import Login from '../views/Login';
import NotFound from '../views/NotFound';
import AuthBasic from '../components/auth/Basic';
import RouterEnter from '../components/auth/RouterEnter';
//机构信息
import Merchant from '../views/organization/merchant'
import Slove from '../views/organization/slove'
import Service from '../views/organization/service'
//基础参数
import Category from '../views/foundation/category'
import Detail from '../views/foundation/Detail'
import AccessMessage from '../views/foundation/accessMessage'
//设备管理
import EquipCategory from '../views/equipment/equipCategory'
import EquipTerminal from '../views/equipment/equipTerminal'
//分润管理
import ShareDetail from '../views/shareBenefit/detail'
import ShareProgram from '../views/shareBenefit/program'
import ShareConfig from '../views/shareBenefit/shareConfig'
import ShareToggle from '../views/shareBenefit/toggle'
//对账信息
import AliPay from '../views/checkBill/aliPay'
import WxPay from '../views/checkBill/wxPay'
import BillDetail from '../views/checkBill/billDetail'
// 报表查询
import TradeBlotter from '../views/reportQuery/tradeBlotter'
import TradeBalcons from '../views/reportQuery/tradeBalcons'
import Chart from '../views/reportQuery/chart'
import Scatter from '../views/reportQuery/scatter'
//用户管理
import User from '../views/user/user'
import Menu from '../views/user/menu'
import UserGroup from '../views/user/userGroup'
//分润数据查询
import BenefitQuery from '../views/benefit/query'
export default class CRouter extends Component {
    requireAuth = (nextState, replace)=>{
        // if(!localStorage.getItem('token')){
        //     replace({
        //         pathname:'/login'
        //     })
        // }
    }

    render() {
        return (
            <Router history={hashHistory}>
                <Route path={'/'} components={Page}>
                    <IndexRedirect to="/app/foundation/accessMessage"/>
                    <Route path={'app'} component={App}>
                        <Route path={"organization"}>
                            <Route path={'merchant'} component={Merchant} />
                            <Route path={'slove'} component={Slove} />
                            <Route path={'service'} component={Service} />
                        </Route>
                        <Route path="foundation">
                            <Route path="category" component={Category} />
                            <Route path="detail" component={Detail} />
                            <Route path="accessMessage" component={AccessMessage} />
                        </Route>
                        <Route path="equipment">
                            <Route path="category" component={EquipCategory} />
                            <Route path="terminal" component={EquipTerminal} />
                        </Route>
                        <Route path={"benefit"}>
                            <Route path={"query"} component={BenefitQuery}></Route>

                        </Route>
                        <Route path="sharebenefit">
                            <Route path="detail" component={ShareDetail} />
                            <Route path="program" component={ShareProgram} />
                            <Route path="config" component={ShareConfig} />
                            <Route path="toggle" component={ShareToggle} />
                        </Route>
                        <Route path="bill">
                            <Route path="alipay" component={AliPay} />
                            <Route path="wxpay" component={WxPay} />
                            <Route path="detail" component={BillDetail} />
                        </Route>
                        <Route path="reportQuert">
                            <Route path="tradeBlotter" component={TradeBlotter} />
                            <Route path="tradeBalcons" component={TradeBalcons} />
                            <Route path="chart" component={Chart} />
                            <Route path="scatter" component={Scatter} />
                        </Route>

                        <Route path="auth">
                            <Route path="basic" component={AuthBasic} />
                            <Route path="routerEnter" component={(props) => this.requireAuth('auth/testPage', <RouterEnter {...props} />)} />
                        </Route>
                        <Route path="user">
                            <Route path="user" component={User} />
                            <Route path="menu" component={Menu} />
                            <Route path="userGroup" component={UserGroup} />
                        </Route>
                    </Route>
                    <Route path={'login'} components={Login} />
                    <Route path={'404'} component={NotFound} />
                </Route>
            </Router>
        )
    }
}