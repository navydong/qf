import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRedirect, Redirect } from 'react-router';
import App from '../App';
import Page from '../views/Page';
// import Login from '../views/Login';
import NotFound from '../views/NotFound';
import Homepage from '../components/Homepage'

// import Reset from '../views/ResetPassword/Reset'


export default class CRouter extends Component {
    requireAuth = (nextState, replace) => {
        // replace({ pathname: '/app/' })
    }
    render() {
        return (
            <Router history={hashHistory}>
                {/* <Route path="/resetPassword" component={Reset} /> */}
                <Route path={'/'} components={Page}>
                    <IndexRedirect to="app/home" />
                    <Route path="app" component={App} onEnter={this.requireAuth} >
                        <Route path="home" component={Homepage} />
                        <Route path="organization">
                            <Route
                                path={'merchant'}
                                getComponent={(location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/organization/merchant').default)
                                    }, 'merchant')
                                }}
                            />
                            <Route
                                path={'slove'}
                                getComponent={(location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/organization/slove').default)
                                    }, 'slove')
                                }}
                            />
                            <Route
                                path={'service'}
                                getComponent={(location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/organization/service').default)
                                    }, 'service')
                                }}
                            />
                        </Route>
                        <Route path="foundation">
                            <Route
                                path="categoryInfo"
                                getComponent={
                                    (location, cb) => {
                                        require.ensure([], (require) => {
                                            cb(null, require('../views/foundation/category').default)
                                        }, 'categoryinfo')
                                    }}
                            />
                            <Route
                                path="accessMessage"
                                getComponent={(location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/foundation/accessMessage').default)
                                    }, 'accessmessage')
                                }}
                            />
                        </Route>
                        <Route path="equipment">
                            <Route path="category" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/equipment/equipCategory').default)
                                    }, 'category')
                                }}
                            />
                            <Route path="terminal" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/equipment/equipTerminal').default)
                                    }, 'terminal')
                                }}
                            />
                            <Route path="qr" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/equipment/qr').default)
                                    }, 'qr')
                                }}
                            />
                        </Route>
                        <Route path={"benefit"}>
                            <Route path={"query"} getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/benefit/query').default)
                                    }, 'benefit')
                                }}
                            />
                        </Route>
                        <Route path={"upload"}>
                            <Route path={"upload"} getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/upload/upload').default)
                                    }, 'upload')
                                }}
                            />
                        </Route>
                        <Route path="sharebenefit">
                            <Route path="program" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/shareBenefit/program').default)
                                    }, 'program')
                                }}
                            />
                            <Route path="config" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/shareBenefit/shareConfig').default)
                                    }, 'config')
                                }}
                            />
                            <Route path="toggle" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/shareBenefit/toggle').default)
                                    }, 'toggle')
                                }}
                            />
                        </Route>
                        <Route path="bill">
                            {/* <Route path="alipay" component={AliPay} /> */}
                            {/* <Route path="wxpay" component={WxPay} /> */}
                            <Route path="billDetail" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/checkBill/bilDetail').default)
                                    }, 'billDetail')
                                }}
                            />
                        </Route>
                        <Route path="reportQuert">
                            <Route path="tradeBlotter(/:id)" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/reportQuery/tradeBlotter').default)
                                    }, 'tradeBlotter')
                                }}
                            />

                            <Route path="tradeBalcons" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/reportQuery/tradeBalcons').default)
                                    }, 'tradeBalcons')
                                }}
                            />
                            <Route path="chart" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/reportQuery/chart').default)
                                    }, 'chart')
                                }}
                            />
                            <Route path="scatter" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/reportQuery/scatter').default)
                                    }, 'scatter')
                                }}
                            />
                            <Route path="refund" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/reportQuery/refund').default)
                                    }, 'refund')
                                }}
                            />
                        </Route>
                        <Route path="user">
                            <Route path="users" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/user/users').default)
                                    }, 'user')
                                }}
                            />
                            <Route
                                path="menu"
                                getComponent={(location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/user/menu').default)
                                    }, 'menu')
                                }}
                            />
                            <Route path="userGroup" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/user/userGroup').default)
                                    }, 'usergroup')
                                }}
                            />
                            <Route path="wxManager" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/user/wxManager').default)
                                    }, 'wxManager')
                                }}
                            />
                        </Route>
                        <Route path="vip" >
                            <Route path="card" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/vip/card').default)
                                    }, 'card')
                                }}
                            />
                            <Route path="members" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/vip/members').default)
                                    }, 'members')
                                }}
                            />
                        </Route>
                        <Route path="order">
                            <Route path="manage" getComponent={
                                (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, require('../views/order').default)
                                    }, 'order')
                                }}
                            />
                        </Route>
                    </Route>
                    {/* <Route path={'login'} components={Login} /> */}
                    <Route path='404' component={NotFound} />
                    <Redirect from='*' to='/404' />
                </Route>
            </Router>
        )
    }
}
