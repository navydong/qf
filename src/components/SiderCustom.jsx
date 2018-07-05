import React, { Component } from 'react';
import { Layout, Menu, Icon, Spin, Alert } from 'antd';
import { Link } from 'react-router';
import axios from 'axios';
import { vipMenu, orderMenu } from './menu'

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


let menus = { home: [], vip: vipMenu, order: orderMenu }
class Storage {
    constructor(storageKey, storageType = localStorage) {
        this.STORAGE_KEY = storageKey
        this.storageType = storageType
    }
    fetch() {
        var storage = JSON.parse(this.storageType.getItem(this.STORAGE_KEY) || '[]')
        this.uid = storage.length
        return storage
    }
    save(openKeys) {
        this.storageType.setItem(this.STORAGE_KEY, JSON.stringify(openKeys))
    }
}
const openKeyStorage = new Storage('openKeys')
const selectedKeysStorage = new Storage('selectedKey')

class SiderCustom extends Component {
    state = {
        openKeys: [],
        selectedKeys: [],
        menuList: []
    };
    componentWillMount() {
        axios.get('/back/menu/system').then(({ data }) => {
            this.setState({
                menuList: data  // 获取菜单列表
            })
            menus.home = data
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
        // 从商户信息跳转到订单明细时，改变菜单状态
        if (/tradeBlotter/.test(nextProps.path)) {
            this.setState(prevState=>({
                selectedKeys: ['tradeBlotter'],
                openKeys: Array.from(new Set([...prevState.openKeys, 'reportQuert']))
            }))
        }
    }

    componentDidMount() {
        this.setState({
            openKeys: openKeyStorage.fetch(),
            selectedKeys: selectedKeysStorage.fetch()
        })
    }
    // 点击菜单导航
    menuClick = ({ key }) => {
        selectedKeysStorage.save([key])
        this.setState({
            selectedKeys: [key]
        })
    };
    // 展开菜单
    openMenu = (v) => {
        openKeyStorage.save(v)
        this.setState({
            openKeys: v
        })
    };

    render() {
        const { selectedKeys, openKeys, menuList } = this.state
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
                    selectedKeys={selectedKeys}
                    onOpenChange={this.openMenu}
                    openKeys={openKeys}
                >
                    {/*菜单树*/}
                    {menuList.length === 0
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
                        this.state.menuList.map((list) => {
                            return list.children && list.children.length !== 0 ?
                                (<SubMenu
                                    key={list.code}
                                    title={<span>{list.icon ? <Icon type={list.icon} /> : null}<span className="nav-text">{list.title}</span></span>}>
                                    {list.children.map((item) => {
                                        if (item.id === '8310001123184bf99c04bcd9769b89e8') {
                                            if (this.props.orgLevel > 1) {
                                                return null
                                            }
                                        }
                                        return item.children && item.children.length !== 0
                                            ? <SubMenu
                                                title={item.title}
                                                key={item.code}>
                                                {item.children.map((third) => {
                                                    return <Menu.Item key={third.code}>
                                                        <Link to={third.href}>{third.title}</Link>
                                                    </Menu.Item>
                                                })}
                                            </SubMenu>
                                            : <Menu.Item key={item.code}>
                                                <Link to={item.href}>{item.title}</Link>
                                            </Menu.Item>
                                    })}
                                </SubMenu>)
                                : <Menu.Item key={list.code}>
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
