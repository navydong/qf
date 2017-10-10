import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router';
import axios from 'axios'
import { notification } from 'antd';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class SiderCustom extends Component {
    state = {
        collapsed: true,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
        menuList: []
    };
    componentDidMount() {
        this.setMenuOpen(this.props);
        axios.defaults.baseURL = 'https://easy-mock.com/mock/59dc63fd1de3d46fa94cf33f/api';
        axios.get('/getMenuList').then(({ data }) => {
            console.log(data)
            if (data.status === 200) {
                this.setState({
                    menuList: data.data  // 获取菜单列表
                })
            } else {
                notification.open({
                    message: '网络错误',
                    description: '网络异常，请您联系管理员,-----刷新下就好了！',
                    style: {
                        backgroundColor: 'orange',
                        color: '#000'
                    }
                });
            }
        })

    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }
    setMenuOpen = props => {
        const { path } = props;
        this.setState({
            openKey: path.substr(0, path.lastIndexOf('/')),
            selectedKey: path
        });
    };
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        console.log(this.state);
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        console.log(v);
        this.setState({
            openKey: v,
            firstHide: false,
        })
    };

    render() {
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{ overflowY: 'auto' }}
            >
                <div className="logo" />
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={this.state.firstHide ? null : [...this.state.openKey]}
                    onOpenChange={this.openMenu}
                >
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="mobile" /><span className="nav-text">首页</span></Link>
                    </Menu.Item>


                    {/*菜单树*/}
                    {this.state.menuList.map((list, index) => {
                        return list.submenu !== undefined ?
                            (<SubMenu
                                key={list.url}
                                title={<span><Icon type={list.icon} /><span className="nav-text">{list.name}</span></span>}>
                                {list.submenu.map((item) => {
                                    return item.submenu !== undefined
                                        ? <SubMenu
                                            title={item.name}
                                            key={item.url}>
                                            {item.submenu.map((third) => {
                                                return <Menu.Item key={third.url}>
                                                    <Link to={third.url}>{third.name}</Link>
                                                </Menu.Item>
                                            })}
                                        </SubMenu>
                                        : <Menu.Item key={item.url}>
                                            <Link to={list.url}>{<span><Icon type={list.icon} /><span className="nav-text">{item.name}</span></span>}</Link>
                                        </Menu.Item>
                                })}
                            </SubMenu>)
                            : <Menu.Item key={list.url}>
                                <Link to={list.url}>{<span><Icon type={list.icon} /><span className="nav-text">{list.name}</span></span>}</Link>
                            </Menu.Item>
                    })}

                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;
