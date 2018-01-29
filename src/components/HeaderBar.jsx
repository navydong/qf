import React, { Component } from 'react';
import { Menu, message } from 'antd';
import { Link } from 'react-router';
import axios from 'axios'
import logo from '../style/imgs/logo.png'
import avater from '../style/imgs/b1.png';
import ChangePwdModal from './changePwdModal'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class HeaderBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isFirst: true,
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isInit == undefined) return
        if (nextProps.isInit && this.state.isFirst) {
            this.setState((prevState) => ({
                visible: true,
                isFirst: prevState.isFirst ? false : prevState.isFirst
            }))
        }
    }
    menuClick = (item, key, keyPath) => {
        switch (item.key) {
            case 'logout':
                const origin = window.location.protocol + '//' +window.location.host
                window.location.replace(origin + '/logout');
                break;
            case 'password':
                this.changepwd()
                break;
            default: ;
        }
    }
    // 密码修改
    changepwd = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (value, callback) => {
        axios.put('/back/user/updatePassword', value).then(res => res.data).then(res => {
            if (res.rel) {
                message.success('修改成功')
                callback()
            } else {
                message.error(res.msg)
            }
        })
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <div className="custom-theme ant-layout-header">
                <div className="header-wrapper">
                    <div className="ant-layout-logo" style={{ marginLeft: 88 }}>
                        <img src={logo} alt="logo" width="50" />
                    </div>
                    <Menu
                        style={{ marginLeft: 138 }}
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        onClick={this.menuClick}
                    >
                        <Menu.Item key="1">
                            <Link to={'/app/home'}><span className="nav-text">首页</span></Link>
                        </Menu.Item>
                        {/* <Menu.Item key="2">管控中心</Menu.Item>
                        <Menu.Item key="3">产品中心</Menu.Item> */}
                        <SubMenu
                            className="account-menu"
                            title={<span className="avatar">
                                <img src={avater} alt="头像" />
                                <i className="on bottom b-white" />
                            </span>}
                        >
                            <MenuItemGroup
                                title={this.props.user}>
                                <Menu.Item key="password">
                                    <span>修改密码</span>
                                </Menu.Item>
                                <Menu.Item key="logout">
                                    <span>退出登录</span>
                                </Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                    </Menu>
                </div>
                <ChangePwdModal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    isInit={this.props.isInit}
                />
            </div>
        )
    }
}

export default HeaderBar