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
import BreadcrumbCustom from '@/components/BreadcrumbCustom'


const { Content, Footer } = Layout;
class App extends Component {
    state = {
        menu: sessionStorage.getItem('menu')||'home'
    }
    handlePwdOk = ()=>{
        console.log('密码修改成功')
    }
    menuChange = (menu)=>{
        this.setState({
            menu
        })
    }
    render() {
        return (
            <div className="ant-layout-topaside">
                <HeaderBar
                    isInit={this.props.isInit}
                    user={this.props.userName}
                    orgType={this.props.orgType}
                    handlePwdOk={this.handlePwdOk}
                    menuChange={this.menuChange}
                />
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-container">
                        <SiderCustom path={this.props.location.pathname} menu={this.state.menu} orgLevel={this.props.orgLevel} />
                        <div className="layout-content">
                            <Content>
                            <BreadcrumbCustom location={this.props.location}/>
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
    //有名字就显示名字，没有名字就显示用户名
    const userName = userInfo.data.name || userInfo.data.username;
    const isInit = userInfo.data.isInit || false;
    const orgLevel = userInfo.data.orgLevel;
    const orgType = userInfo.data.orgType;
    return { userInfo, userName, isInit, orgLevel, orgType };
};
const mapDispatchToProps = dispatch => ({
    getMenu: dispatch(getMenu()),
    getCurrentUser: dispatch(getCurrentUser())
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
