import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
    componentDidMount() {
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }
    setMenuOpen = props => {
        const {path} = props;
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
                style={{overflowY: 'auto'}}
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
                    <SubMenu
                        key="/app/ui"
                        title={<span><Icon type="scan" /><span className="nav-text">移动支付管理平台</span></span>}
                    >

                        <Menu.Item key="/app/ui/buttons">
                        <Link to={'/app/ui/buttons'}>基础设置</Link>
                        </Menu.Item>
                        <Menu.Item key="/app/ui/icons"><Link to={'/app/ui/icons'}>机构管理</Link></Menu.Item>
                        <Menu.Item key="/app/ui/spins"><Link to={'/app/ui/spins'}>权限管理</Link></Menu.Item>
                        <Menu.Item key="/app/ui/modals"><Link to={'/app/ui/modals'}>商户管理</Link></Menu.Item>
                        <Menu.Item key="/app/ui/notifications"><Link to={'/app/ui/notifications'}>分润管理</Link></Menu.Item>
                        <Menu.Item key="/app/ui/tabs"><Link to={'/app/ui/tabs'}>设备管理</Link></Menu.Item>
                        <Menu.Item key="/app/ui/banners"><Link to={'/app/ui/banners'}>清分管理</Link></Menu.Item>
                        <Menu.Item key="/app/ui/wysiwyg"><Link to={'/app/ui/wysiwyg'}>报表查询</Link></Menu.Item>
                        <Menu.Item key="/app/ui/drags"><Link to={'/app/ui/drags'}>对账管理</Link></Menu.Item>
                        {/*<Menu.Item key="/app/ui/gallery"></Menu.Item>*/}
                        <SubMenu 
                            key="/app/ui/gallery" 
                            title={<span><Icon type="scan" /><span className="nav-text">其他</span></span> }
                        >
                            <Menu.Item key="/app/ui/gallery">
                               <Link to={'/app/ui/gallery'}>自定义功能组</Link>
                            </Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    
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