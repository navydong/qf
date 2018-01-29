import React, { Component } from 'react';
import axios from 'axios'
import '../node_modules/antd/dist/antd.less'
import { Layout, Affix } from 'antd';
import './style/index.less';
import HeaderBar from './components/HeaderBar'
import SiderCustom from './components/SiderCustom';
import { getMenu, getCurrentUser } from './redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { Content, Footer } = Layout;


class App extends Component {
    render() {
        return (
            <div className="ant-layout-topaside">
                <HeaderBar 
                    user={this.props.userName} 
                    isInit={this.props.isInit}
                />
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-container">
                        <SiderCustom path={this.props.location.pathname} />
                        <div className="layout-content">
                            <Content>
                                {this.props.children}
                            </Content>
                        </div>
                    </div> 
                </div>
                <Footer style={{ textAlign: 'center', marginLeft: 220 }}>
                    {/* ©2017 赢时胜科技股份有限公司 */}
                </Footer>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { auth = {data: {}}, responsive = {data: {}}, user= {data: {}} } = state.httpData;
    const isInit = user.data.isInit;
    const userName = user.data.name || user.data.username;
    return {auth, responsive, user, isInit, userName};
};
const mapDispatchToProps = dispatch => ({
    getMenu: dispatch(getMenu()),
    getCurrentUser: dispatch(getCurrentUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
