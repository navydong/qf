import React, { Component } from 'react';
import { Layout, Menu, Icon, Spin, Alert } from 'antd';
import { Link } from 'react-router';
import axios from 'axios';
import { vipMenu, orderMenu } from './menu'

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


let menus = { home: [], vip: vipMenu, order: orderMenu }

class SiderCustom extends Component {
    state = {
        openKey: [],
        selectedKeys: [],
        menuList: []
    };
    componentWillMount() {
        axios.get('/back/menu/system').then((resp) => {
            const data = resp.data;
            if (resp.status === 200) {
                this.setState({
                    menuList: data  // 获取菜单列表
                })
                menus.home = data
            }
        }).then(() => {
            const currentMenu = sessionStorage.getItem('menu')
            if (currentMenu == 'vip' || currentMenu == 'order') {
                this.setState({
                    menuList: menus[currentMenu],
                })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.menu) {
            // console.log(menus[nextProps.menu])
            this.setState({
                menuList: menus[nextProps.menu]
            })
        }
    }

    componentDidMount() {
        let openkeys = localStorage.getItem('openKey') == undefined ? ['移动支付管理平台', '权限管理'] : localStorage.getItem('openKey').split(',');
        let selectedKeys = JSON.parse(localStorage.getItem('selectedKeys'))
        this.setState({
            openKey: openkeys,
            selectedKeys: selectedKeys
        })
        // localStorage.removeItem('openKey')
    }

    menuClick = ({ item, key, keyPath }) => {
        this.setState(prevState => {
            return {
                selectedKeys: [key]
            }
        })
        localStorage.setItem('selectedKeys', JSON.stringify([key]))
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        //console.log(v)
        let openKey = '';
        if (v.length > 1) {
            v.forEach((item) => {
                openKey += `${item},`
            })
        }
        openKey = (openKey.substring(openKey.length - 1) === ',') ? openKey.substring(0, openKey.length - 1) : openKey;
        //console.log(openKey)
        localStorage.setItem('openKey', openKey)
        this.setState({
            openKey: v
        })
    };

    render() {
        const menu = this.props.menu
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={false}
                width="220"
            >
                <Menu
                    onClick={this.menuClick}
                    theme="default"
                    mode="inline"
                    selectedKeys={this.state.selectedKeys}
                    onOpenChange={this.openMenu}
                    openKeys={this.state.openKey}
                >
                    {/* <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="mobile" /><span className="nav-text">首页</span></Link>
                    </Menu.Item> */}
                    {/*菜单树*/}
                    {this.state.menuList.length === 0
                        ?
                        //菜单未加载出来的loading
                        <Menu.Item>
                            <div style={{ marginTop: 10 }}>
                                <Spin tip="Loading..." size="large">
                                    <Alert
                                        message="正在加载菜单..."
                                    />
                                </Spin>
                            </div>
                        </Menu.Item>
                        :
                        this.state.menuList.map((list, index) => {
                            return list.children && list.children.length !== 0 ?
                                (<SubMenu
                                    key={list.title}
                                    title={<span>{list.icon ? <Icon type={list.icon} /> : null}<span className="nav-text">{list.title}</span></span>}>
                                    {list.children.map((item, index) => {
                                        if(item.id === '8310001123184bf99c04bcd9769b89e8'){
                                            if(this.props.orgLevel > 1){
                                                return null
                                            }
                                        }
                                        return item.children && item.children.length !== 0
                                            ? <SubMenu
                                                title={item.title}
                                                key={item.title}>
                                                {item.children.map((third, index) => {
                                                    return <Menu.Item key={third.title}>
                                                        <Link to={third.href}>{third.title}</Link>
                                                    </Menu.Item>
                                                })}
                                            </SubMenu>
                                            : <Menu.Item key={index}>
                                                <Link to={item.href}>{item.title}</Link>
                                            </Menu.Item>
                                    })}
                                </SubMenu>)
                                : <Menu.Item key={index}>
                                    <Link to={list.href}>{<span className="nav-text">{list.title}</span>}</Link>
                                </Menu.Item>
                        })
                    }
                </Menu>
            </Sider >
        )
    }
}

export default SiderCustom;
