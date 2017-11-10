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
        openKey: [],
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
        menuList: []
    };
    componentDidMount() {
        console.log(this.props)
        this.setMenuOpen(this.props);
        axios.get('/back/menu/system').then((resp) => {
            const data = resp.data;
            if (resp.status === 200) {
                this.setState({
                    menuList: data  // 获取菜单列表
                })
            } else {
                notification.open({
                    message: '错误',
                    description: '网络异常',
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
                width="258"
            >
                <Menu
                    onClick={this.menuClick}
                    theme="default"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    onOpenChange={this.openMenu}
                >
                    {/* <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="mobile" /><span className="nav-text">首页</span></Link>
                    </Menu.Item> */}


                    {/*菜单树*/}
                    {this.state.menuList.map((list, index) => {
                        return list.children && list.children.length !== 0 ?
                            (<SubMenu
                                key={list.title}
                                title={<span><span className="nav-text">{list.title}</span></span>}>
                                {list.children.map((item,index) => {
                                    return item.children && item.children.length !== 0
                                        ? <SubMenu
                                            title={<span><span className="nav-text">{item.title}</span></span>}
                                            key={item.title}>
                                            {item.children.map((third,index) => {
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
                    })}

                </Menu>
            </Sider >
        )
    }
}

export default SiderCustom;
