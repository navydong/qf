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
        }
    }

    logout = () => {
        // window.location.href = '/logout'
        axios.get('/logout').then((res)=>{
            // window.location = res.request.responseURL
        })
    };
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
                    >
                        <Menu.Item key="1">
                            <Link to={'/app/user/userGroup'}><span className="nav-text">首页</span></Link>
                        </Menu.Item>
                        {/* <Menu.Item key="2">管控中心</Menu.Item>
                        <Menu.Item key="3">产品中心</Menu.Item> */}
                        <SubMenu className="account-menu" title=
                            {<span className="avatar">
                                <img src={avater} alt="头像" />
                                <i className="on bottom b-white" />
                            </span>}
                        >
                            <MenuItemGroup title={this.props.user.userName}>
                                <Menu.Item key="i0">
                                    <span onClick={this.changepwd}>修改密码</span>
                                </Menu.Item>
                                <Menu.Item key="i1">
                                    <span onClick={this.logout}>退出登录</span>
                                </Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                    </Menu>
                </div>
                <ChangePwdModal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                />
            </div>
        )
    }
}

export default HeaderBar