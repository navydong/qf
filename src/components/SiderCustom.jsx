import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router';
import axios from 'axios'
import { notification } from 'antd';
import { sliderBar } from '../utils/index'

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class SiderCustom extends Component {
    state = {
        collapsed: true,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
        menuList: sliderBar
    };
    componentDidMount() {
        this.setMenuOpen(this.props);
        axios.get('/api/getMenuList').then(({ data }) => {
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
        .catch((err)=>{
            notification.open({
                message: '菜单加载失败',
                description: err.message,
                style: {
                    backgroundColor: 'white',
                    color: '#000'
                }
            });
        })

    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    } d
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
            <aside 
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                className="ant-layout-sider"
            >
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}

                    onOpenChange={this.openMenu}
                >
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="mobile" /><span className="nav-text">首页</span></Link>
                    </Menu.Item>


                    {/*菜单树*/}
                    {this.state.menuList.map((list, index) => {
                        return list.submenu !== undefined ?
                            (<SubMenu
                                key={list.name}
                                title={<span><Icon type={list.icon} /><span className="nav-text">{list.name}</span></span>}>
                                {list.submenu.map((item) => {
                                    return item.submenu !== undefined
                                        ? <SubMenu
                                            title={item.name}
                                            key={item.name}>
                                            {item.submenu.map((third) => {
                                                return <Menu.Item key={third.url}>
                                                    <Link to={third.url}>{third.name}</Link>
                                                </Menu.Item>
                                            })}
                                        </SubMenu>
                                        : <Menu.Item key={item.url}>
                                            <Link to={item.url}>{item.name}</Link>
                                        </Menu.Item>
                                })}
                            </SubMenu>)
                            : <Menu.Item key={list.url}>
                                <Link to={list.url}>{<span><Icon type={list.icon} /><span className="nav-text">{list.name}</span></span>}</Link>
                            </Menu.Item>
                    })}

                </Menu>
            </aside >
        )
    }
}

export default SiderCustom;
