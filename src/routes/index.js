import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import App from '../App';
import Page from '../views/Page';
import BasicForm from '../components/forms/BasicForm';
import BasicTable from '../components/tables/BasicTables';
import AdvancedTable from '../components/tables/AdvancedTables';
import AsynchronousTable from '../components/tables/AsynchronousTable';
import Login from '../views/Login';
import Echarts from '../components/charts/Echarts';
import Recharts from '../components/charts/Recharts';
import Icons from '../components/ui/Icons';
import Buttons from '../components/ui/Buttons';
import Spins from '../components/ui/Spins';
import Modals from '../components/ui/Modals';
import Notifications from '../components/ui/Notifications';
import Tabs from '../components/ui/Tabs';
import Banners from '../components/ui/banners';
import Drags from '../components/ui/Draggable';
import Dashboard from '../components/dashboard/Dashboard';
import Gallery from '../components/ui/Gallery';
import NotFound from '../views/NotFound';
import BasicAnimations from '../components/animation/BasicAnimations';
import ExampleAnimations from '../components/animation/ExampleAnimations';
import AuthBasic from '../components/auth/Basic';
import RouterEnter from '../components/auth/RouterEnter';
import MyTable from '../components/tables/MyTable'
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
import TradeBalcons from '../views/reportQuery/trandeBalcons'
import Chart from '../views/reportQuery/Chart'
import Scatter from '../views/reportQuery/scatter'

const Wysiwyg = (location, cb) => {     // 按需加载富文本配置
    require.ensure([], require => {
        cb(null, require('../components/ui/Wysiwyg').default);
    }, 'Wysiwyg');
};

export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const { store } = this.props;
        const { auth } = store.getState().httpData;
        console.log(auth)
        if (!auth || !auth.data.permissions.includes(permission)) hashHistory.replace('/404');
        return component;
    };
    render() {
        return (
            <Router history={hashHistory}>
                <Route path={'/'} components={Page}>
                    <IndexRedirect to="/login" />
                    <Route path={'app'} component={App}>
                        <Route path={'form'}>
                            <Route path={'basicForm'} component={BasicForm} />
                        </Route>
                        <Route path={"organization"}>
                            <Route path={'merchant'} component={Merchant} />
                            <Route path={'slove'} component={Slove} />
                            <Route path={'service'} component={Service} />
                        </Route>
                        <Route path="foundation">
                            <Route path="category" component={Category} />
                            <Route path="detail" component={Detail} />
                            <Route path="template" component={AccessMessage}></Route>
                        </Route>
                        <Route path="equipment">
                            <Route path="category" component={EquipCategory} />
                            <Route path="terminal" component={EquipTerminal} />
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
                        <Route path={'table'}>
                            <Route path={'myTable'} component={MyTable} />
                            <Route path={'basicTable'} component={BasicTable} />
                            <Route path={'advancedTable'} components={AdvancedTable} />
                            <Route path={'asynchronousTable'} components={AsynchronousTable} />
                        </Route>
                        <Route path={'chart'}>
                            <Route path={'echarts'} component={Echarts} />
                            <Route path={'recharts'} component={Recharts} />
                        </Route>
                        <Route path={'ui'}>
                            <Route path={'icons'} component={Icons} />
                            <Route path={'buttons'} component={Buttons} />
                            <Route path={'spins'} component={Spins} />
                            <Route path={'modals'} component={Modals} />
                            <Route path={'notifications'} component={Notifications} />
                            <Route path={'tabs'} component={Tabs} />
                            <Route path={'banners'} component={Banners} />
                            <Route path={'wysiwyg'} getComponent={Wysiwyg} />
                            <Route path={'drags'} component={Drags} />
                            <Route path={'gallery'} component={Gallery} />
                        </Route>
                        <Route path={'animation'}>
                            <Route path={'basicAnimations'} component={BasicAnimations} />
                            <Route path={'exampleAnimations'} component={ExampleAnimations} />
                        </Route>
                        <Route path={'dashboard/index'} component={Dashboard} />
                        <Route path="auth">
                            <Route path="basic" component={AuthBasic} />
                            <Route path="routerEnter" component={(props) => this.requireAuth('auth/testPage', <RouterEnter {...props} />)} />
                        </Route>
                    </Route>
                    <Route path={'login'} components={Login} />
                    <Route path={'404'} component={NotFound} />
                </Route>
            </Router>
        )
    }
}