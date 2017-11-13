import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router';
import logo from '../style/imgs/logo.png'
import avater from '../style/imgs/b1.jpg';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderBar extends Component {
    constructor(props){
        super(props)
    }

    logout = () => {
       window.location.href = '/logout'
    };

    render(){
        return (
            <div className="custom-theme ant-layout-header">
                <div className="header-wrapper">
                    <div className="ant-layout-logo custom-theme">
                        <img src={logo} alt="logo" className="App-logo" />
                    </div>
                    <Menu theme="default" mode="horizontal"
                          defaultSelectedKeys={['1']} style={{lineHeight: '64px'}}>
                        <Menu.Item key="1">
                            <Link to={'/app/dashboard/index'}><span className="nav-text">首页</span></Link>
                        </Menu.Item>
                        <Menu.Item key="2">管控中心</Menu.Item>
                        <Menu.Item key="3">产品中心</Menu.Item>
                        <SubMenu className="account-menu" title={<span className="avatar"><img src={avater} alt="头像" /><i className="on bottom b-white" /></span>}>
                            <MenuItemGroup title="用户中心">
                                {/*<Menu.Item key="setting:1">你好 - {this.props.user.userName}</Menu.Item>*/}
                                {/*<Menu.Item key="setting:2">个人信息</Menu.Item>*/}
                                <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                            </MenuItemGroup>
                            {/*<MenuItemGroup title="设置中心">*/}
                                {/*<Menu.Item key="setting:3">个人设置</Menu.Item>*/}
                                {/*<Menu.Item key="setting:4">系统设置</Menu.Item>*/}
                            {/*</MenuItemGroup>*/}
                        </SubMenu>
                    </Menu>
                </div>
            </div>
        )
    }
}

export default HeaderBar