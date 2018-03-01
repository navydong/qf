import React, { Component } from 'react'
import axios from 'axios'
import { Layout, Affix } from 'antd'
import SiderCustom from './components/SiderCustom'
import { getMenu, getCurrentUser } from './redux/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HeaderBar from './components/HeaderBar'
import '../node_modules/antd/dist/antd.less'
import './style/index.less'
import './App.css'


const { Content, Footer } = Layout;
class App extends Component {
    handlePwdOk = ()=>{
        console.log('密码修改成功')
    }
    render() {
        return (
            <div className="ant-layout-topaside">
                <HeaderBar 
                    user={this.props.userName} 
                    isInit={this.props.isInit}
                    handlePwdOk={this.handlePwdOk}
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
                </Footer>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { userInfo = { data: {} } } = state;
    const isInit = userInfo.data.isInit || false;
    //有名字就显示名字，没有名字就显示用户名
    const userName = userInfo.data.name || userInfo.data.username;
    return { userInfo, isInit, userName };
};
const mapDispatchToProps = dispatch => ({
    getMenu: dispatch(getMenu()),
    getCurrentUser: dispatch(getCurrentUser())
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
